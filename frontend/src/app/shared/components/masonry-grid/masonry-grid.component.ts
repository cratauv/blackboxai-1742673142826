import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MasonryItem {
  id: string;
  height?: number;
  loaded?: boolean;
}

@Component({
  selector: 'app-masonry-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Grid Container -->
      <div
        #container
        class="relative w-full"
        [style.height.px]="containerHeight"
      >
        <!-- Grid Items -->
        @for (item of items; track item.id) {
          <div
            class="absolute w-full transition-all duration-300"
            [style.width]="getItemWidth()"
            [style.transform]="getItemTransform(item)"
            [style.opacity]="item.loaded ? 1 : 0"
          >
            <div class="p-2">
              <ng-container
                [ngTemplateOutlet]="itemTemplate"
                [ngTemplateOutletContext]="{ $implicit: item }"
              ></ng-container>
            </div>
          </div>
        }
      </div>

      <!-- Loading State -->
      @if (loading) {
        <div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            @if (loadingText) {
              <p class="mt-2 text-sm text-gray-600">{{ loadingText }}</p>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class MasonryGridComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @Input() items: MasonryItem[] = [];
  @Input() columns = 3;
  @Input() gutter = 16;
  @Input() itemTemplate: any;
  @Input() loading = false;
  @Input() loadingText = '';

  private resizeObserver?: ResizeObserver;
  private itemHeights: Map<string, number> = new Map();
  private columnHeights: number[] = [];
  containerHeight = 0;

  ngAfterViewInit(): void {
    this.initializeResizeObserver();
    this.calculateLayout();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  ngOnChanges(): void {
    this.calculateLayout();
  }

  private initializeResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.calculateLayout();
    });
    this.resizeObserver.observe(this.container.nativeElement);
  }

  private calculateLayout(): void {
    if (!this.container) return;

    const containerWidth = this.container.nativeElement.offsetWidth;
    const columnWidth = (containerWidth - (this.columns - 1) * this.gutter) / this.columns;

    // Reset column heights
    this.columnHeights = Array(this.columns).fill(0);

    // Position each item
    this.items.forEach(item => {
      const height = this.itemHeights.get(item.id) || 0;
      const shortestColumn = this.getShortestColumn();
      
      item.height = height;
      this.columnHeights[shortestColumn] += height + this.gutter;
    });

    // Update container height
    this.containerHeight = Math.max(...this.columnHeights) - this.gutter;
  }

  private getShortestColumn(): number {
    return this.columnHeights.indexOf(Math.min(...this.columnHeights));
  }

  getItemWidth(): string {
    if (!this.container) return `${100 / this.columns}%`;
    
    const containerWidth = this.container.nativeElement.offsetWidth;
    const width = (containerWidth - (this.columns - 1) * this.gutter) / this.columns;
    return `${width}px`;
  }

  getItemTransform(item: MasonryItem): string {
    const index = this.items.indexOf(item);
    if (index === -1) return 'translate(0, 0)';

    const column = index % this.columns;
    const containerWidth = this.container.nativeElement.offsetWidth;
    const columnWidth = (containerWidth - (this.columns - 1) * this.gutter) / this.columns;
    
    const x = column * (columnWidth + this.gutter);
    const y = this.getItemTop(index);

    return `translate(${x}px, ${y}px)`;
  }

  private getItemTop(index: number): number {
    let column = index % this.columns;
    let top = 0;

    for (let i = 0; i < index; i++) {
      if (i % this.columns === column) {
        const item = this.items[i];
        top += (item.height || 0) + this.gutter;
      }
    }

    return top;
  }

  // Helper method to update item height
  updateItemHeight(id: string, height: number): void {
    this.itemHeights.set(id, height);
    this.calculateLayout();
  }

  // Helper method to mark item as loaded
  markItemLoaded(id: string): void {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.loaded = true;
    }
  }

  // Helper method to get column count based on container width
  getResponsiveColumns(containerWidth: number): number {
    if (containerWidth < 640) return 1;
    if (containerWidth < 768) return 2;
    return this.columns;
  }

  // Helper method to check if all items are loaded
  areAllItemsLoaded(): boolean {
    return this.items.every(item => item.loaded);
  }

  // Helper method to get items in a specific column
  getColumnItems(columnIndex: number): MasonryItem[] {
    return this.items.filter((_, index) => index % this.columns === columnIndex);
  }

  // Helper method to get column width
  getColumnWidth(): number {
    const containerWidth = this.container.nativeElement.offsetWidth;
    return (containerWidth - (this.columns - 1) * this.gutter) / this.columns;
  }

  // Helper method to get column height
  getColumnHeight(columnIndex: number): number {
    return this.columnHeights[columnIndex] || 0;
  }

  // Helper method to refresh layout
  refresh(): void {
    this.calculateLayout();
  }

  // Helper method to clear layout
  clear(): void {
    this.items = [];
    this.itemHeights.clear();
    this.columnHeights = Array(this.columns).fill(0);
    this.containerHeight = 0;
  }

  // Helper method to add items
  addItems(newItems: MasonryItem[]): void {
    this.items = [...this.items, ...newItems];
    this.calculateLayout();
  }

  // Helper method to remove item
  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.itemHeights.delete(id);
    this.calculateLayout();
  }

  // Helper method to update columns
  updateColumns(count: number): void {
    this.columns = count;
    this.calculateLayout();
  }

  // Helper method to update gutter
  updateGutter(size: number): void {
    this.gutter = size;
    this.calculateLayout();
  }
}