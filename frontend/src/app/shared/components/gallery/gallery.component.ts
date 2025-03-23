import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryItem {
  id: string | number;
  src: string;
  thumbnail?: string;
  alt?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <!-- Gallery Grid -->
      <div [class]="getGridClasses()">
        @for (item of filteredItems; track item.id) {
          <div
            class="relative group overflow-hidden rounded-lg"
            [class.cursor-pointer]="lightbox"
            (click)="onItemClick(item)"
          >
            <!-- Image -->
            <img
              [src]="item.thumbnail || item.src"
              [alt]="item.alt || item.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            >

            <!-- Overlay -->
            @if (showOverlay) {
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                <div class="absolute inset-x-0 bottom-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  @if (item.title) {
                    <h3 class="text-lg font-semibold truncate">{{ item.title }}</h3>
                  }
                  @if (item.description) {
                    <p class="text-sm truncate">{{ item.description }}</p>
                  }
                  @if (item.tags?.length) {
                    <div class="flex flex-wrap gap-2 mt-2">
                      @for (tag of item.tags; track tag) {
                        <span class="px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full">
                          {{ tag }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }

        <!-- Empty State -->
        @if (filteredItems.length === 0) {
          <div class="col-span-full p-8 text-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">{{ emptyMessage }}</p>
          </div>
        }
      </div>

      <!-- Lightbox -->
      @if (lightbox && selectedItem) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          (click)="closeLightbox()"
        >
          <!-- Image Container -->
          <div
            class="relative max-w-7xl max-h-screen p-4"
            (click)="$event.stopPropagation()"
          >
            <!-- Navigation -->
            @if (canNavigate) {
              <button
                type="button"
                class="absolute top-1/2 left-4 -translate-y-1/2 p-2 text-white hover:text-gray-300"
                [class.invisible]="!canShowPrevious()"
                (click)="previousItem()"
              >
                <i class="fas fa-chevron-left text-2xl"></i>
              </button>
              <button
                type="button"
                class="absolute top-1/2 right-4 -translate-y-1/2 p-2 text-white hover:text-gray-300"
                [class.invisible]="!canShowNext()"
                (click)="nextItem()"
              >
                <i class="fas fa-chevron-right text-2xl"></i>
              </button>
            }

            <!-- Close Button -->
            <button
              type="button"
              class="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
              (click)="closeLightbox()"
            >
              <i class="fas fa-times text-xl"></i>
            </button>

            <!-- Image -->
            <img
              [src]="selectedItem.src"
              [alt]="selectedItem.alt || selectedItem.title"
              class="max-w-full max-h-[calc(100vh-8rem)] object-contain mx-auto"
            >

            <!-- Caption -->
            @if (showCaption && (selectedItem.title || selectedItem.description)) {
              <div class="absolute inset-x-0 bottom-0 p-4 text-white text-center bg-black bg-opacity-50">
                @if (selectedItem.title) {
                  <h3 class="text-lg font-semibold">{{ selectedItem.title }}</h3>
                }
                @if (selectedItem.description) {
                  <p class="text-sm mt-1">{{ selectedItem.description }}</p>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class GalleryComponent {
  @Input() items: GalleryItem[] = [];
  @Input() columns: number = 3;
  @Input() gap: number = 4;
  @Input() lightbox = true;
  @Input() showOverlay = true;
  @Input() showCaption = true;
  @Input() canNavigate = true;
  @Input() emptyMessage = 'No images to display';
  @Input() filter?: string;

  @Output() itemClick = new EventEmitter<GalleryItem>();
  @Output() lightboxOpen = new EventEmitter<GalleryItem>();
  @Output() lightboxClose = new EventEmitter<void>();

  selectedItem: GalleryItem | null = null;

  get filteredItems(): GalleryItem[] {
    if (!this.filter) return this.items;
    const lowercaseFilter = this.filter.toLowerCase();
    return this.items.filter(item =>
      item.title?.toLowerCase().includes(lowercaseFilter) ||
      item.description?.toLowerCase().includes(lowercaseFilter) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowercaseFilter))
    );
  }

  getGridClasses(): string {
    return `
      grid gap-${this.gap}
      grid-cols-1
      sm:grid-cols-2
      ${this.columns >= 3 ? 'lg:grid-cols-3' : ''}
      ${this.columns >= 4 ? 'xl:grid-cols-4' : ''}
      ${this.columns >= 5 ? '2xl:grid-cols-5' : ''}
    `;
  }

  onItemClick(item: GalleryItem): void {
    this.itemClick.emit(item);
    if (this.lightbox) {
      this.selectedItem = item;
      this.lightboxOpen.emit(item);
    }
  }

  closeLightbox(): void {
    this.selectedItem = null;
    this.lightboxClose.emit();
  }

  previousItem(): void {
    if (!this.selectedItem) return;
    const currentIndex = this.items.indexOf(this.selectedItem);
    if (currentIndex > 0) {
      this.selectedItem = this.items[currentIndex - 1];
      this.lightboxOpen.emit(this.selectedItem);
    }
  }

  nextItem(): void {
    if (!this.selectedItem) return;
    const currentIndex = this.items.indexOf(this.selectedItem);
    if (currentIndex < this.items.length - 1) {
      this.selectedItem = this.items[currentIndex + 1];
      this.lightboxOpen.emit(this.selectedItem);
    }
  }

  canShowPrevious(): boolean {
    if (!this.selectedItem) return false;
    return this.items.indexOf(this.selectedItem) > 0;
  }

  canShowNext(): boolean {
    if (!this.selectedItem) return false;
    return this.items.indexOf(this.selectedItem) < this.items.length - 1;
  }

  // Helper method to add item
  addItem(item: GalleryItem): void {
    this.items.push(item);
  }

  // Helper method to remove item
  removeItem(id: string | number): void {
    this.items = this.items.filter(item => item.id !== id);
    if (this.selectedItem?.id === id) {
      this.closeLightbox();
    }
  }

  // Helper method to update item
  updateItem(id: string | number, updates: Partial<GalleryItem>): void {
    const item = this.items.find(item => item.id === id);
    if (item) {
      Object.assign(item, updates);
      if (this.selectedItem?.id === id) {
        this.selectedItem = item;
      }
    }
  }

  // Helper method to set items
  setItems(items: GalleryItem[]): void {
    this.items = items;
    this.closeLightbox();
  }

  // Helper method to clear items
  clearItems(): void {
    this.items = [];
    this.closeLightbox();
  }

  // Helper method to get item by id
  getItem(id: string | number): GalleryItem | undefined {
    return this.items.find(item => item.id === id);
  }

  // Helper method to get selected item index
  getSelectedIndex(): number {
    return this.selectedItem ? this.items.indexOf(this.selectedItem) : -1;
  }

  // Helper method to check if has items
  hasItems(): boolean {
    return this.items.length > 0;
  }

  // Helper method to get item count
  getItemCount(): number {
    return this.items.length;
  }

  // Helper method to filter items by tag
  filterByTag(tag: string): GalleryItem[] {
    return this.items.filter(item => 
      item.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Helper method to get all unique tags
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.items.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }
}