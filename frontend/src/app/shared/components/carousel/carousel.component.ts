import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

interface CarouselSlide {
  id: string | number;
  image?: string;
  title?: string;
  description?: string;
  content?: any;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative group">
      <!-- Slides Container -->
      <div
        #slidesContainer
        class="relative overflow-hidden rounded-lg"
        [class.aspect-video]="maintainAspectRatio"
      >
        <!-- Slides -->
        @for (slide of slides; track slide.id) {
          <div
            class="absolute inset-0 w-full"
            [class.hidden]="currentIndex !== slides.indexOf(slide)"
            [@slideAnimation]="getAnimationState(slides.indexOf(slide))"
          >
            @if (slide.image) {
              <img
                [src]="slide.image"
                [alt]="slide.title"
                class="w-full h-full object-cover"
                [class.object-contain]="imageContain"
              />
            }

            @if (slide.content) {
              <ng-container
                [ngTemplateOutlet]="slide.content"
              ></ng-container>
            }

            <!-- Caption -->
            @if (showCaptions && (slide.title || slide.description)) {
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
                @if (slide.title) {
                  <h3 class="text-lg font-semibold">{{ slide.title }}</h3>
                }
                @if (slide.description) {
                  <p class="mt-1 text-sm">{{ slide.description }}</p>
                }
              </div>
            }
          </div>
        }

        <!-- Navigation Arrows -->
        @if (showArrows && slides.length > 1) {
          <button
            type="button"
            class="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            (click)="previous()"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            type="button"
            class="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            (click)="next()"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        }

        <!-- Indicators -->
        @if (showIndicators && slides.length > 1) {
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            @for (slide of slides; track slide.id) {
              <button
                type="button"
                class="w-2 h-2 rounded-full transition-all"
                [class]="getIndicatorClasses(slides.indexOf(slide))"
                (click)="goToSlide(slides.indexOf(slide))"
              ></button>
            }
          </div>
        }
      </div>

      <!-- Thumbnails -->
      @if (showThumbnails && slides.length > 1) {
        <div class="flex justify-center mt-4 space-x-2">
          @for (slide of slides; track slide.id) {
            <button
              type="button"
              class="relative w-16 h-16 rounded-lg overflow-hidden focus:outline-none"
              [class]="getThumbnailClasses(slides.indexOf(slide))"
              (click)="goToSlide(slides.indexOf(slide))"
            >
              @if (slide.image) {
                <img
                  [src]="slide.image"
                  [alt]="slide.title"
                  class="w-full h-full object-cover"
                />
              }
            </button>
          }
        </div>
      }
    </div>
  `,
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class CarouselComponent {
  @ViewChild('slidesContainer') slidesContainer!: ElementRef;

  @Input() slides: CarouselSlide[] = [];
  @Input() currentIndex = 0;
  @Input() autoPlay = true;
  @Input() autoPlayInterval = 5000;
  @Input() showArrows = true;
  @Input() showIndicators = true;
  @Input() showThumbnails = false;
  @Input() showCaptions = true;
  @Input() maintainAspectRatio = true;
  @Input() imageContain = false;
  @Input() loop = true;

  @Output() slideChange = new EventEmitter<number>();

  private autoPlayTimer?: number;

  ngOnInit(): void {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  ngOnChanges(): void {
    if (this.autoPlay) {
      this.restartAutoPlay();
    }
  }

  previous(): void {
    this.goToSlide(this.currentIndex - 1);
  }

  next(): void {
    this.goToSlide(this.currentIndex + 1);
  }

  goToSlide(index: number): void {
    if (this.loop) {
      if (index < 0) {
        index = this.slides.length - 1;
      } else if (index >= this.slides.length) {
        index = 0;
      }
    } else {
      if (index < 0 || index >= this.slides.length) {
        return;
      }
    }

    this.currentIndex = index;
    this.slideChange.emit(index);
    this.restartAutoPlay();
  }

  getAnimationState(index: number): string {
    return `${index}`;
  }

  getIndicatorClasses(index: number): string {
    return `
      ${index === this.currentIndex
        ? 'bg-white w-4'
        : 'bg-white bg-opacity-50 hover:bg-opacity-75'}
    `;
  }

  getThumbnailClasses(index: number): string {
    return `
      ${index === this.currentIndex
        ? 'ring-2 ring-primary-500'
        : 'opacity-50 hover:opacity-75'}
    `;
  }

  private startAutoPlay(): void {
    if (this.slides.length > 1) {
      this.autoPlayTimer = window.setInterval(() => {
        this.next();
      }, this.autoPlayInterval);
    }
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }

  private restartAutoPlay(): void {
    this.stopAutoPlay();
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  // Helper method to add slide
  addSlide(slide: CarouselSlide): void {
    this.slides = [...this.slides, slide];
  }

  // Helper method to remove slide
  removeSlide(slideId: string | number): void {
    const index = this.slides.findIndex(slide => slide.id === slideId);
    if (index !== -1) {
      this.slides = this.slides.filter(slide => slide.id !== slideId);
      if (this.currentIndex >= this.slides.length) {
        this.goToSlide(this.slides.length - 1);
      }
    }
  }

  // Helper method to update slide
  updateSlide(slideId: string | number, updates: Partial<CarouselSlide>): void {
    this.slides = this.slides.map(slide =>
      slide.id === slideId ? { ...slide, ...updates } : slide
    );
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

  // Helper method to toggle autoplay
  toggleAutoPlay(enabled: boolean): void {
    this.autoPlay = enabled;
    if (enabled) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }

  // Helper method to set interval
  setInterval(interval: number): void {
    this.autoPlayInterval = interval;
    this.restartAutoPlay();
  }

  // Helper method to get slide index
  getSlideIndex(slideId: string | number): number {
    return this.slides.findIndex(slide => slide.id === slideId);
  }
}