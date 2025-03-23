import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselSlide {
  id: string | number;
  type: 'image' | 'video' | 'content';
  src?: string;
  alt?: string;
  title?: string;
  description?: string;
  content?: any;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full overflow-hidden rounded-lg">
      <!-- Slides Container -->
      <div
        class="relative h-full"
        [style.paddingBottom]="aspectRatio"
      >
        @for (slide of slides; track slide.id; let i = $index) {
          <div
            class="absolute inset-0 w-full h-full transition-opacity duration-500"
            [class.opacity-100]="i === currentIndex"
            [class.opacity-0]="i !== currentIndex"
          >
            @switch (slide.type) {
              @case ('image') {
                <img
                  [src]="slide.src"
                  [alt]="slide.alt"
                  class="w-full h-full object-cover"
                  [class.cursor-pointer]="clickable"
                  (click)="onSlideClick(slide)"
                >
              }
              @case ('video') {
                <video
                  [src]="slide.src"
                  class="w-full h-full object-cover"
                  [controls]="showControls"
                  [autoplay]="autoplay"
                  [loop]="loop"
                  [muted]="muted"
                >
                </video>
              }
              @default {
                <div class="w-full h-full flex items-center justify-center">
                  <ng-container [ngTemplateOutlet]="slide.content"></ng-container>
                </div>
              }
            }

            <!-- Caption -->
            @if (showCaptions && (slide.title || slide.description)) {
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
                @if (slide.title) {
                  <h3 class="text-lg font-semibold">{{ slide.title }}</h3>
                }
                @if (slide.description) {
                  <p class="text-sm">{{ slide.description }}</p>
                }
              </div>
            }
          </div>
        }

        <!-- Navigation Arrows -->
        @if (showArrows && slides.length > 1) {
          <button
            type="button"
            class="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 focus:outline-none"
            (click)="previous()"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            type="button"
            class="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 focus:outline-none"
            (click)="next()"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        }

        <!-- Indicators -->
        @if (showIndicators && slides.length > 1) {
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            @for (slide of slides; track slide.id; let i = $index) {
              <button
                type="button"
                class="w-2 h-2 rounded-full transition-all duration-300 focus:outline-none"
                [class]="getIndicatorClasses(i)"
                (click)="goToSlide(i)"
              ></button>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class CarouselComponent {
  @Input() slides: CarouselSlide[] = [];
  @Input() currentIndex = 0;
  @Input() autoplay = true;
  @Input() interval = 5000;
  @Input() showArrows = true;
  @Input() showIndicators = true;
  @Input() showCaptions = true;
  @Input() aspectRatio = '56.25%'; // 16:9
  @Input() clickable = false;
  @Input() loop = true;
  @Input() showControls = false;
  @Input() muted = true;

  @Output() slideChange = new EventEmitter<number>();
  @Output() slideClick = new EventEmitter<CarouselSlide>();

  private autoplayInterval?: number;

  ngOnInit(): void {
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  getIndicatorClasses(index: number): string {
    return `
      ${index === this.currentIndex
        ? 'bg-white w-3'
        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
      }
    `;
  }

  previous(): void {
    this.goToSlide(
      this.currentIndex === 0
        ? (this.loop ? this.slides.length - 1 : 0)
        : this.currentIndex - 1
    );
  }

  next(): void {
    this.goToSlide(
      this.currentIndex === this.slides.length - 1
        ? (this.loop ? 0 : this.slides.length - 1)
        : this.currentIndex + 1
    );
  }

  goToSlide(index: number): void {
    if (index !== this.currentIndex && index >= 0 && index < this.slides.length) {
      this.currentIndex = index;
      this.slideChange.emit(this.currentIndex);
      if (this.autoplay) {
        this.resetAutoplay();
      }
    }
  }

  onSlideClick(slide: CarouselSlide): void {
    if (this.clickable) {
      this.slideClick.emit(slide);
    }
  }

  private startAutoplay(): void {
    this.autoplayInterval = window.setInterval(() => {
      if (this.loop || this.currentIndex < this.slides.length - 1) {
        this.next();
      }
    }, this.interval);
  }

  private stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  private resetAutoplay(): void {
    this.stopAutoplay();
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  // Helper method to add slide
  addSlide(slide: CarouselSlide): void {
    this.slides.push(slide);
  }

  // Helper method to remove slide
  removeSlide(id: string | number): void {
    const index = this.slides.findIndex(s => s.id === id);
    if (index !== -1) {
      this.slides.splice(index, 1);
      if (this.currentIndex >= this.slides.length) {
        this.currentIndex = this.slides.length - 1;
      }
    }
  }

  // Helper method to set slides
  setSlides(slides: CarouselSlide[]): void {
    this.slides = slides;
    this.currentIndex = 0;
  }

  // Helper method to toggle autoplay
  toggleAutoplay(enabled: boolean): void {
    this.autoplay = enabled;
    if (enabled) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  // Helper method to set interval
  setInterval(interval: number): void {
    this.interval = interval;
    if (this.autoplay) {
      this.resetAutoplay();
    }
  }

  // Helper method to get current slide
  getCurrentSlide(): CarouselSlide | undefined {
    return this.slides[this.currentIndex];
  }

  // Helper method to check if can go previous
  canGoPrevious(): boolean {
    return this.loop || this.currentIndex > 0;
  }

  // Helper method to check if can go next
  canGoNext(): boolean {
    return this.loop || this.currentIndex < this.slides.length - 1;
  }

  // Helper method to get slide count
  getSlideCount(): number {
    return this.slides.length;
  }

  // Helper method to check if is first slide
  isFirstSlide(): boolean {
    return this.currentIndex === 0;
  }

  // Helper method to check if is last slide
  isLastSlide(): boolean {
    return this.currentIndex === this.slides.length - 1;
  }
}