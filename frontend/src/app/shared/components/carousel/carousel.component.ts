import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface CarouselSlide {
  id: string;
  image?: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    url: string;
  };
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative group">
      <!-- Slides Container -->
      <div 
        class="relative overflow-hidden rounded-lg"
        [class.aspect-video]="maintainAspectRatio"
      >
        <!-- Slides -->
        @for (slide of slides; track slide.id; let i = $index) {
          <div
            class="absolute inset-0 w-full"
            [class.hidden]="currentIndex !== i"
            [@slideAnimation]="getAnimationState(i)"
          >
            <!-- Image -->
            @if (slide.image) {
              <img
                [src]="slide.image"
                [alt]="slide.title || ''"
                class="w-full h-full object-cover"
              />
            }

            <!-- Content Overlay -->
            @if (slide.title || slide.description) {
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <div class="text-center text-white p-6">
                  @if (slide.title) {
                    <h3 class="text-2xl font-bold mb-2">{{ slide.title }}</h3>
                  }
                  @if (slide.description) {
                    <p class="text-sm mb-4">{{ slide.description }}</p>
                  }
                  @if (slide.action) {
                    <a
                      [href]="slide.action.url"
                      class="inline-flex items-center px-4 py-2 rounded-md bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      {{ slide.action.label }}
                      <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        }

        <!-- Navigation Arrows -->
        @if (showArrows && slides.length > 1) {
          <!-- Previous -->
          <button
            type="button"
            class="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
            (click)="previous()"
          >
            <span class="sr-only">Previous slide</span>
            <i class="fas fa-chevron-left"></i>
          </button>

          <!-- Next -->
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
            (click)="next()"
          >
            <span class="sr-only">Next slide</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        }

        <!-- Indicators -->
        @if (showIndicators && slides.length > 1) {
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            @for (slide of slides; track slide.id; let i = $index) {
              <button
                type="button"
                class="w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
                [class]="getIndicatorClasses(i)"
                (click)="goToSlide(i)"
              >
                <span class="sr-only">Go to slide {{ i + 1 }}</span>
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class CarouselComponent {
  @Input() slides: CarouselSlide[] = [];
  @Input() showArrows = true;
  @Input() showIndicators = true;
  @Input() autoPlay = true;
  @Input() interval = 5000;
  @Input() maintainAspectRatio = true;
  @Input() pauseOnHover = true;

  @Output() slideChange = new EventEmitter<number>();

  currentIndex = 0;
  private autoPlayInterval?: number;
  private direction: 'next' | 'prev' = 'next';

  ngOnInit(): void {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  next(): void {
    this.direction = 'next';
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.slideChange.emit(this.currentIndex);
  }

  previous(): void {
    this.direction = 'prev';
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.slideChange.emit(this.currentIndex);
  }

  goToSlide(index: number): void {
    this.direction = index > this.currentIndex ? 'next' : 'prev';
    this.currentIndex = index;
    this.slideChange.emit(this.currentIndex);
  }

  getIndicatorClasses(index: number): string {
    return index === this.currentIndex
      ? 'bg-white'
      : 'bg-white bg-opacity-50 hover:bg-opacity-75';
  }

  getAnimationState(index: number): string {
    return index.toString();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = window.setInterval(() => {
      this.next();
    }, this.interval);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = undefined;
    }
  }

  // Helper method to pause autoplay
  pause(): void {
    if (this.pauseOnHover) {
      this.stopAutoPlay();
    }
  }

  // Helper method to resume autoplay
  resume(): void {
    if (this.pauseOnHover && this.autoPlay && !this.autoPlayInterval) {
      this.startAutoPlay();
    }
  }

  // Helper method to check if current slide is first
  isFirstSlide(): boolean {
    return this.currentIndex === 0;
  }

  // Helper method to check if current slide is last
  isLastSlide(): boolean {
    return this.currentIndex === this.slides.length - 1;
  }

  // Helper method to get current slide
  getCurrentSlide(): CarouselSlide {
    return this.slides[this.currentIndex];
  }

  // Helper method to get animation duration
  getAnimationDuration(): number {
    return 300; // milliseconds
  }

  // Helper method to get animation timing
  getAnimationTiming(): string {
    return 'ease-out';
  }

  // Helper method to get slide width
  getSlideWidth(): number {
    return 100; // percentage
  }

  // Helper method to get slide height
  getSlideHeight(): string {
    return this.maintainAspectRatio ? 'auto' : '100%';
  }
}