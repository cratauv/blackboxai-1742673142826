import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'custom';
  format?: (value: any) => string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableSort {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, SearchBarComponent],
  template: `
    <div class="w-full">
      <!-- Table Controls -->
      @if (showControls) {
        <div class="mb-4 flex items-center justify-between">
          <!-- Search -->
          @if (showSearch) {
            <div class="w-72">
              <app-search-bar
                [placeholder]="searchPlaceholder"
                (search)="onSearch($event)"
              />
            </div>
          }

          <!-- Additional Controls -->
          <div class="flex items-center space-x-2">
            <ng-content select="[tableControls]"></ng-content>
          </div>
        </div>
      }

      <!-- Table Container -->
      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table Header -->
          <thead class="bg-gray-50">
            <tr>
              @for (column of columns; track column.key) {
                <th
                  scope="col"
                  [style.width]="column.width"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  [class.cursor-pointer]="column.sortable"
                  [class.text-center]="column.align === 'center'"
                  [class.text-right]="column.align === 'right'"
                  (click)="column.sortable && onSort(column.key)"
                >
                  <div class="flex items-center" [class.justify-end]="column.align === 'right'">
                    {{ column.label }}
                    
                    @if (column.sortable) {
                      <span class="ml-2">
                        @if (sort?.column === column.key) {
                          <i 
                            class="fas"
                            [class.fa-sort-up]="sort.direction === 'asc'"
                            [class.fa-sort-down]="sort.direction === 'desc'"
                          ></i>
                        } @else {
                          <i class="fas fa-sort text-gray-300"></i>
                        }
                      </span>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            @if (loading) {
              <tr>
                <td [attr.colspan]="columns.length" class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center">
                    <div class="w-6 h-6 border-2 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                    <span class="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
            } @else if (data.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length" class="px-6 py-4 text-center text-gray-500">
                  {{ emptyMessage }}
                </td>
              </tr>
            } @else {
              @for (row of data; track trackBy(row)) {
                <tr 
                  class="hover:bg-gray-50 transition-colors"
                  [class.cursor-pointer]="rowClickable"
                  (click)="onRowClick(row)"
                >
                  @for (column of columns; track column.key) {
                    <td 
                      class="px-6 py-4 whitespace-nowrap text-sm"
                      [class.text-center]="column.align === 'center'"
                      [class.text-right]="column.align === 'right'"
                    >
                      @if (column.type === 'custom') {
                        <ng-container 
                          *ngTemplateOutlet="customTemplate; context: { $implicit: row, column: column }"
                        ></ng-container>
                      } @else {
                        {{ formatCellValue(row, column) }}
                      }
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (showPagination && totalItems > 0) {
        <div class="mt-4">
          <app-pagination
            [currentPage]="currentPage"
            [totalPages]="totalPages"
            [totalItems]="totalItems"
            [pageSize]="pageSize"
            (pageChange)="onPageChange($event)"
          />
        </div>
      }
    </div>
  `
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() showControls = true;
  @Input() showSearch = true;
  @Input() showPagination = true;
  @Input() searchPlaceholder = 'Search...';
  @Input() emptyMessage = 'No data available';
  @Input() rowClickable = false;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() totalPages = 1;
  @Input() sort?: TableSort;
  @Input() trackBy: (item: any) => any = item => item.id;

  @Output() sortChange = new EventEmitter<TableSort>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() rowClick = new EventEmitter<any>();

  onSort(column: string): void {
    const newSort: TableSort = {
      column,
      direction: this.sort?.column === column && this.sort?.direction === 'asc' ? 'desc' : 'asc'
    };
    this.sortChange.emit(newSort);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onSearch(query: string): void {
    this.searchChange.emit(query);
  }

  onRowClick(row: any): void {
    if (this.rowClickable) {
      this.rowClick.emit(row);
    }
  }

  formatCellValue(row: any, column: TableColumn): string {
    const value = row[column.key];
    
    if (column.format) {
      return column.format(value);
    }

    switch (column.type) {
      case 'date':
        return this.formatDate(value);
      case 'currency':
        return this.formatCurrency(value);
      case 'boolean':
        return this.formatBoolean(value);
      default:
        return value?.toString() || '';
    }
  }

  private formatDate(value: any): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString();
  }

  private formatCurrency(value: any): string {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  private formatBoolean(value: any): string {
    return value ? 'Yes' : 'No';
  }

  // Helper method to get column by key
  getColumn(key: string): TableColumn | undefined {
    return this.columns.find(col => col.key === key);
  }

  // Helper method to check if column is sorted
  isColumnSorted(key: string): boolean {
    return this.sort?.column === key;
  }

  // Helper method to get sort direction for column
  getSortDirection(key: string): 'asc' | 'desc' | undefined {
    return this.isColumnSorted(key) ? this.sort?.direction : undefined;
  }

  // Helper method to get cell alignment class
  getCellAlignClass(align?: string): string {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  }
}