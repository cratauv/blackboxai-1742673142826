import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

interface GalleryItem {
  id: string | number;
  src: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

type GalleryLayout = 'grid' | 'masonry' | 'justified';
type GalleryLightboxPosition = 'top' | 'bottom';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <!-- Gallery Grid -->
      <div
        [class]="getGalleryClasses()"
        [style.gridTemplateColumns]="getGridColumns()"
      >
        @for (item of filteredItems; track item.id) {
          <div
            class="relative group overflow-hidden"
            [class]="getItemClasses()"
            (click)="openLightbox(item)"
          >
            <!-- Image -->
            <img
              [src]="item.thumbnail || item.src"
              [alt]="item.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <!-- Overlay -->
            @if (showOverlay) {
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity">
                <div class="absolute inset-x-0 bottom-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  @if (item.title) {
                    <h3 class="text-lg font-semibold truncate">{{ item.title }}</h3>
                  }
                  @if (item.description) {
                    <p class="text-sm truncate">{{ item.description }}</p>
                  }
                </div>
              </div>
            }

            <!-- Tags -->
            @if (showTags && item.tags?.length) {
              <div class="absolute top-2 left-2 flex flex-wrap gap-1">
                @for (tag of item.tags; track tag) {
                  <span class="px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded-full">
                    {{ tag }}
                  </span>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Lightbox -->
      @if (lightboxOpen) {
        <div
          class="fixed inset-0 z-50 bg-black"
          [@fadeAnimation]
        >
          <!-- Lightbox Content -->
          <div class="h-full flex flex-col">
            <!-- Header -->
            @if (lightboxPosition === 'top') {
              <div class="p-4 text-white">
                <h3 class="text-xl font-semibold">{{ currentItem?.title }}</h3>
                @if (currentItem?.description) {
                  <p class="mt-1 text-sm text-gray-300">{{ currentItem?.description }}</p>
                }
              </div>
            }

            <!-- Image Container -->
            <div class="flex-1 relative">
              <!-- Image -->
              <img
                [src]="currentItem?.src"
                [alt]="currentItem?.title"
                class="absolute inset-0 w-full h-full object-contain"
              />

              <!-- Navigation Arrows -->
              @if (filteredItems.length > 1) {
                <button
                  type="button"
                  class="absolute top-1/2 left-4 -translate-y-1/2 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full"
                  (click)="previousImage()"
                >
                  <i class="fas fa-chevron-left text-2xl"></i>
                </button>
                <button
                  type="button"
                  class="absolute top-1/2 right-4 -translate-y-1/2 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full"
                  (click)="nextImage()"
                >
                  <i class="fas fa-chevron-right text-2xl"></i>
                </button>
              }
            </div>

            <!-- Footer -->
            @if (lightboxPosition === 'bottom') {
              <div class="p-4 text-white">
                <h3 class="text-xl font-semibold">{{ currentItem?.title }}</h3>
                @if (currentItem?.description) {
                  <p class="mt-1 text-sm text-gray-300">{{ currentItem?.description }}</p>
                }
              </div>
            }

            <!-- Close Button -->
            <button
              type="button"
              class="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full"
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
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class GalleryComponent {
  @Input() items: GalleryItem[] = [];
  @Input() layout: GalleryLayout = 'grid';
  @Input() columns = 3;
  @Input() gap = 4;
  @Input() showOverlay = true;
  @Input() showTags = true;
  @Input() lightboxPosition: GalleryLightboxPosition = 'bottom';
  @Input() filter?: string[];

  @Output() itemClick = new EventEmitter<GalleryItem>();

  lightboxOpen = false;
  currentIndex = 0;

  get filteredItems(): GalleryItem[] {
    if (!this.filter?.length) return this.items;
    return this.items.filter(item =>
      item.tags?.some(tag => this.filter?.includes(tag))
    );
  }

  get currentItem(): GalleryItem | undefined {
    return this.filteredItems[this.currentIndex];
  }

  getGalleryClasses(): string {
    return `
      grid
      gap-${this.gap}
      ${this.layout === 'masonry' ? 'masonry' : ''}
    `;
  }

  getGridColumns(): string {
    return `repeat(${this.columns}, minmax(0, 1fr))`;
  }

  getItemClasses(): string {
    return `
      ${this.layout === 'justified' ? 'aspect-video' : ''}
      cursor-pointer
      rounded-lg
      overflow-hidden
    `;
  }

  openLightbox(item: GalleryItem): void {
    this.currentIndex = this.filteredItems.findIndex(i => i.id === item.id);
    this.lightboxOpen = true;
    this.itemClick.emit(item);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  previousImage(): void {
    this.currentIndex = this.currentIndex > 0
      ? this.currentIndex - 1
      : this.filteredItems.length - 1;
  }

  nextImage(): void {
    this.currentIndex = this.currentIndex < this.filteredItems.length - 1
      ? this.currentIndex + 1
      : 0;
  }

  // Helper method to add item
  addItem(item: GalleryItem): void {
    this.items = [...this.items, item];
  }

  // Helper method to remove item
  removeItem(itemId: string | number): void {
    this.items = this.items.filter(item => item.id !== itemId);
    if (this.lightboxOpen && this.currentItem?.id === itemId) {
      this.closeLightbox();
    }
  }

  // Helper method to update item
  updateItem(itemId: string | number, updates: Partial<GalleryItem>): void {
    this.items = this.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
  }

  // Helper method to set filter
  setFilter(tags: string[]): void {
    this.filter = tags;
  }

  // Helper method to clear filter
  clearFilter(): void {
    this.filter = undefined;
  }

  // Helper method to get all tags
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.items.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }

  // Helper method to get items by tag
  getItemsByTag(tag: string): GalleryItem[] {
    return this.items.filter(item => item.tags?.includes(tag));
  }

  // Helper method to set layout
  setLayout(layout: GalleryLayout): void {
    this.layout = layout;
  }

  // Helper method to set columns
  setColumns(columns: number): void {
    this.columns = columns;
  }

  // Helper method to toggle overlay
  toggleOverlay(show: boolean): void {
    this.showOverlay = show;
  }

  // Helper method to toggle tags
  toggleTags(show: boolean): void {
    this.showTags = show;
  }

  // Helper method to set lightbox position
  setLightboxPosition(position: GalleryLightboxPosition): void {
    this.lightboxPosition = position;
  }
}