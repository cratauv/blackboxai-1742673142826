import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;
type GridGap = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="w-full"
      [class.grid]="!masonry"
      [class]="getGridClasses()"
    >
      <!-- Masonry Layout -->
      @if (masonry) {
        <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          @for (item of items; track trackBy(item)) {
            <div class="break-inside-avoid mb-4">
              <ng-container 
                *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
              ></ng-container>
            </div>
          }
        </div>
      }

      <!-- Regular Grid Layout -->
      @if (!masonry) {
        @for (item of items; track trackBy(item)) {
          <div [class]="getItemClasses()">
            <ng-container 
              *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
            ></ng-container>
          </div>
        }
      }

      <!-- Empty State -->
      @if (items.length === 0) {
        <div 
          class="col-span-full flex items-center justify-center p-8 text-center"
          [class]="getEmptyStateClasses()"
        >
          @if (emptyStateTemplate) {
            <ng-container *ngTemplateOutlet="emptyStateTemplate"></ng-container>
          } @else {
            <div class="text-gray-500">{{ emptyMessage }}</div>
          }
        </div>
      }
    </div>
  `
})
export class GridComponent {
  @Input() items: any[] = [];
  @Input() columns: GridColumns = 3;
  @Input() gap: GridGap = 'md';
  @Input() masonry = false;
  @Input() itemTemplate: any;
  @Input() emptyStateTemplate: any;
  @Input() emptyMessage = 'No items to display';
  @Input() trackBy: (item: any) => any = item => item.id;

  getGridClasses(): string {
    if (this.masonry) return '';

    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'
    };

    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6'
    };

    return `${columnClasses[this.columns]} ${gapClasses[this.gap]}`;
  }

  getItemClasses(): string {
    return this.masonry ? 'break-inside-avoid mb-4' : '';
  }

  getEmptyStateClasses(): string {
    const baseClasses = 'rounded-lg border-2 border-dashed border-gray-300 bg-white';
    return this.masonry ? `${baseClasses} col-span-full` : baseClasses;
  }

  // Helper method to get responsive columns based on screen size
  getResponsiveColumns(screenSize: 'sm' | 'md' | 'lg'): number {
    const breakpoints = {
      sm: Math.min(2, this.columns),
      md: Math.min(3, this.columns),
      lg: this.columns
    };
    return breakpoints[screenSize];
  }

  // Helper method to get gap size in pixels
  getGapSize(): number {
    const gapSizes = {
      none: 0,
      sm: 8,
      md: 16,
      lg: 24
    };
    return gapSizes[this.gap];
  }

  // Helper method to check if grid is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Helper method to get total rows
  getTotalRows(): number {
    return Math.ceil(this.items.length / this.columns);
  }

  // Helper method to get items in a specific row
  getItemsInRow(rowIndex: number): any[] {
    const startIndex = rowIndex * this.columns;
    return this.items.slice(startIndex, startIndex + this.columns);
  }

  // Helper method to check if item is in the last row
  isLastRow(itemIndex: number): boolean {
    const totalRows = this.getTotalRows();
    const itemRow = Math.floor(itemIndex / this.columns);
    return itemRow === totalRows - 1;
  }

  // Helper method to check if item is in the last column
  isLastColumn(itemIndex: number): boolean {
    return (itemIndex + 1) % this.columns === 0;
  }

  // Helper method to get column span for an item
  getColumnSpan(itemIndex: number): number {
    const remainingItems = this.items.length - itemIndex;
    const remainingColumns = this.columns - (itemIndex % this.columns);
    
    if (this.isLastRow(itemIndex) && remainingItems < remainingColumns) {
      return remainingItems;
    }
    return 1;
  }

  // Helper method to calculate optimal columns for masonry layout
  getMasonryColumns(): number {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 1024) return Math.min(4, this.columns);
    if (viewportWidth >= 768) return Math.min(3, this.columns);
    if (viewportWidth >= 640) return Math.min(2, this.columns);
    return 1;
  }

  // Helper method to distribute items evenly in masonry columns
  getMasonryColumnItems(columnIndex: number): any[] {
    const columns = this.getMasonryColumns();
    return this.items.filter((_, index) => index % columns === columnIndex);
  }

  // Helper method to get masonry column width
  getMasonryColumnWidth(): string {
    const columns = this.getMasonryColumns();
    const gapSize = this.getGapSize();
    return `calc((100% - ${(columns - 1) * gapSize}px) / ${columns})`;
  }
}