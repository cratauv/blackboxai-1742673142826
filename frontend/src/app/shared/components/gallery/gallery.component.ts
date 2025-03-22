import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface GalleryItem {
  id: string;
  src: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

type GalleryLayout = 'grid' | 'masonry' | 'carousel';
type GallerySize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- Gallery Controls -->
      @if (showControls) {
        <div class="flex items-center justify-between">
          <!-- Layout Switcher -->
          <div class="flex rounded-md shadow-sm">
            @for (layout of ['grid', 'masonry', 'carousel']; track layout) {
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium border first:rounded-l-md last:rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10"
                [class]="getLayoutButtonClasses(layout)"
                (click)="switchLayout(layout as GalleryLayout)"
              >
                <i [class]="getLayoutIcon(layout)"></i>
                <span class="ml-2">{{ layout | titlecase }}</span>
              </button>
            }
          </div>

          <!-- Filter -->
          @if (showFilter && hasTaggedItems()) {
            <div class="flex items-center space-x-2">
              @for (tag of getAllTags(); track tag) {
                <button
                  type="button"
                  class="px-3 py-1 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                  [class]="getTagButtonClasses(tag)"
                  (click)="toggleTag(tag)"
                >
                  {{ tag }}
                </button>
              }
            </div>
          }
        </div>
      }

      <!-- Gallery Content -->
      <div [ngSwitch]="layout">
        <!-- Grid Layout -->
        @case ('grid') {
          <div
            class="grid gap-4"
            [class]="getGridClasses()"
          >
            @for (item of filteredItems; track item.id) {
              <div
                class="relative group overflow-hidden rounded-lg cursor-pointer"
                (click)="openLightbox(item)"
              >
                <img
                  [src]="item.thumbnail || item.src"
                  [alt]="item.title || ''"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                @if (item.title || item.description) {
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-end">
                    <div class="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      @if (item.title) {
                        <h3 class="text-lg font-semibold">{{ item.title }}</h3>
                      }
                      @if (item.description) {
                        <p class="text-sm">{{ item.description }}</p>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- Masonry Layout -->
        @case ('masonry') {
          <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            @for (item of filteredItems; track item.id) {
              <div
                class="relative group overflow-hidden rounded-lg cursor-pointer mb-4 break-inside-avoid"
                (click)="openLightbox(item)"
              >
                <img
                  [src]="item.thumbnail || item.src"
                  [alt]="item.title || ''"
                  class="w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                @if (item.title || item.description) {
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-end">
                    <div class="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      @if (item.title) {
                        <h3 class="text-lg font-semibold">{{ item.title }}</h3>
                      }
                      @if (item.description) {
                        <p class="text-sm">{{ item.description }}</p>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- Carousel Layout -->
        @case ('carousel') {
          <div class="relative group">
            <div class="overflow-hidden rounded-lg">
              @for (item of filteredItems; track item.id; let i = $index) {
                <div
                  class="absolute inset-0 transition-opacity duration-300"
                  [class.opacity-0]="currentIndex !== i"
                  [class.opacity-100]="currentIndex === i"
                >
                  <img
                    [src]="item.src"
                    [alt]="item.title || ''"
                    class="w-full h-full object-contain"
                  />
                </div>
              }
            </div>

            <!-- Navigation Arrows -->
            <button
              type="button"
              class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              (click)="previousSlide()"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              (click)="nextSlide()"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        }
      }

      <!-- Lightbox -->
      @if (lightboxOpen) {
        <div
          class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          (click)="closeLightbox()"
        >
          <div class="relative max-w-7xl mx-auto px-4">
            <img
              [src]="selectedItem?.src"
              [alt]="selectedItem?.title || ''"
              class="max-h-[90vh] object-contain"
            />
            @if (selectedItem?.title || selectedItem?.description) {
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
                @if (selectedItem?.title) {
                  <h3 class="text-xl font-semibold">{{ selectedItem?.title }}</h3>
                }
                @if (selectedItem?.description) {
                  <p class="mt-2">{{ selectedItem?.description }}</p>
                }
              </div>
            }
            <button
              type="button"
              class="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
              (click)="closeLightbox()"
            >
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class GalleryComponent {
  @Input() items: GalleryItem[] = [];
  @Input() layout: GalleryLayout = 'grid';
  @Input() size: GallerySize = 'md';
  @Input() showControls = true;
  @Input() showFilter = true;

  @Output() itemClick = new EventEmitter<GalleryItem>();

  selectedTags: Set<string> = new Set();
  lightboxOpen = false;
  selectedItem?: GalleryItem;
  currentIndex = 0;

  getLayoutButtonClasses(layoutType: string): string {
    const baseClasses = 'border-gray-300';
    return layoutType === this.layout
      ? `${baseClasses} bg-primary-50 text-primary-600 border-primary-600 z-10`
      : `${baseClasses} bg-white text-gray-700 hover:bg-gray-50`;
  }

  getLayoutIcon(layout: string): string {
    const icons = {
      grid: 'fas fa-th',
      masonry: 'fas fa-columns',
      carousel: 'fas fa-images'
    };
    return icons[layout as keyof typeof icons];
  }

  getTagButtonClasses(tag: string): string {
    return this.selectedTags.has(tag)
      ? 'bg-primary-100 text-primary-800'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }

  getGridClasses(): string {
    const columns = {
      sm: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
      md: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
      lg: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
    };
    return columns[this.size];
  }

  switchLayout(layout: GalleryLayout): void {
    this.layout = layout;
  }

  toggleTag(tag: string): void {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
  }

  openLightbox(item: GalleryItem): void {
    this.selectedItem = item;
    this.currentIndex = this.filteredItems.indexOf(item);
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.selectedItem = undefined;
  }

  previousSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
    this.selectedItem = this.filteredItems[this.currentIndex];
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.filteredItems.length;
    this.selectedItem = this.filteredItems[this.currentIndex];
  }

  get filteredItems(): GalleryItem[] {
    if (this.selectedTags.size === 0) return this.items;
    return this.items.filter(item =>
      item.tags?.some(tag => this.selectedTags.has(tag))
    );
  }

  hasTaggedItems(): boolean {
    return this.items.some(item => item.tags?.length);
  }

  getAllTags(): string[] {
    const tags = new Set<string>();
    this.items.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }

  // Helper method to get image dimensions
  getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = src;
    });
  }

  // Helper method to check if image is landscape
  isLandscape(width: number, height: number): boolean {
    return width > height;
  }

  // Helper method to get aspect ratio
  getAspectRatio(width: number, height: number): number {
    return width / height;
  }

  // Helper method to get optimal column span
  getColumnSpan(aspectRatio: number): number {
    if (aspectRatio > 2) return 2;
    if (aspectRatio < 0.5) return 1;
    return 1;
  }
}