import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  format?: (value: any) => string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableSort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface TableFilter {
  column: string;
  value: string;
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="overflow-hidden rounded-lg border">
      <!-- Table Header -->
      <div class="bg-gray-50 border-b px-6 py-3">
        <div class="flex items-center justify-between">
          <!-- Search -->
          @if (showSearch) {
            <div class="relative">
              <input
                type="text"
                class="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Search..."
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
              />
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          }

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <!-- Column Visibility -->
            @if (showColumnToggle) {
              <div class="relative">
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  (click)="toggleColumnMenu()"
                >
                  <i class="fas fa-columns mr-2"></i>
                  Columns
                </button>

                @if (showColumnMenu) {
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                    <div class="p-2">
                      @for (column of columns; track column.key) {
                        <label class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            [checked]="!isColumnHidden(column.key)"
                            (change)="toggleColumn(column.key)"
                            class="mr-2"
                          />
                          {{ column.label }}
                        </label>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Export -->
            @if (showExport) {
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                (click)="exportData()"
              >
                <i class="fas fa-download mr-2"></i>
                Export
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Column Headers -->
          <thead class="bg-gray-50">
            <tr>
              <!-- Selection Column -->
              @if (selectable) {
                <th class="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    [checked]="isAllSelected()"
                    (change)="toggleAllRows()"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              }

              <!-- Data Columns -->
              @for (column of visibleColumns; track column.key) {
                <th
                  [class]="getColumnHeaderClasses(column)"
                  [style.width]="column.width"
                >
                  <div class="flex items-center space-x-1">
                    <span>{{ column.label }}</span>
                    @if (column.sortable) {
                      <button
                        type="button"
                        class="p-1 hover:bg-gray-200 rounded"
                        (click)="sortBy(column.key)"
                      >
                        <i [class]="getSortIcon(column.key)"></i>
                      </button>
                    }
                  </div>
                </th>
              }
            </tr>

            <!-- Filter Row -->
            @if (showFilters) {
              <tr>
                @if (selectable) {
                  <th></th>
                }
                @for (column of visibleColumns; track column.key) {
                  <th class="px-6 py-2">
                    @if (column.filterable) {
                      <input
                        type="text"
                        class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        [placeholder]="'Filter ' + column.label.toLowerCase()"
                        [(ngModel)]="filters[column.key]"
                        (input)="onFilter()"
                      />
                    }
                  </th>
                }
              </tr>
            }
          </thead>

          <!-- Table Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            @for (row of paginatedData; track row.id) {
              <tr
                [class.bg-gray-50]="isSelected(row)"
                class="hover:bg-gray-50"
              >
                @if (selectable) {
                  <td class="px-6 py-4">
                    <input
                      type="checkbox"
                      [checked]="isSelected(row)"
                      (change)="toggleRow(row)"
                      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                }
                @for (column of visibleColumns; track column.key) {
                  <td [class]="getColumnClasses(column)">
                    {{ formatCellValue(row[column.key], column) }}
                  </td>
                }
              </tr>
            }

            <!-- Empty State -->
            @if (paginatedData.length === 0) {
              <tr>
                <td
                  [attr.colspan]="selectable ? visibleColumns.length + 1 : visibleColumns.length"
                  class="px-6 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Table Footer -->
      @if (showPagination) {
        <div class="bg-gray-50 border-t px-6 py-3">
          <div class="flex items-center justify-between">
            <!-- Page Size -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700">Show</span>
              <select
                class="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                [(ngModel)]="pagination.pageSize"
                (change)="onPageSizeChange()"
              >
                <option [value]="10">10</option>
                <option [value]="25">25</option>
                <option [value]="50">50</option>
                <option [value]="100">100</option>
              </select>
              <span class="text-sm text-gray-700">entries</span>
            </div>

            <!-- Pagination -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700">
                Showing {{ getStartIndex() + 1 }} to {{ getEndIndex() }} of {{ filteredData.length }} entries
              </span>
              <div class="flex space-x-1">
                <button
                  type="button"
                  class="px-3 py-1 text-sm font-medium rounded-md border"
                  [class.bg-gray-100]="pagination.page > 1"
                  [class.text-gray-300]="pagination.page === 1"
                  [disabled]="pagination.page === 1"
                  (click)="previousPage()"
                >
                  Previous
                </button>
                <button
                  type="button"
                  class="px-3 py-1 text-sm font-medium rounded-md border"
                  [class.bg-gray-100]="hasNextPage()"
                  [class.text-gray-300]="!hasNextPage()"
                  [disabled]="!hasNextPage()"
                  (click)="nextPage()"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() selectable = false;
  @Input() showSearch = true;
  @Input() showFilters = true;
  @Input() showPagination = true;
  @Input() showColumnToggle = true;
  @Input() showExport = true;

  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<TableSort>();
  @Output() filterChange = new EventEmitter<TableFilter[]>();
  @Output() pageChange = new EventEmitter<TablePagination>();

  searchQuery = '';
  filters: { [key: string]: string } = {};
  sort: TableSort = { column: '', direction: 'asc' };
  pagination: TablePagination = { page: 1, pageSize: 10, total: 0 };
  selectedRows = new Set<any>();
  hiddenColumns = new Set<string>();
  showColumnMenu = false;

  get visibleColumns(): TableColumn[] {
    return this.columns.filter(column => !this.hiddenColumns.has(column.key));
  }

  get filteredData(): any[] {
    let result = [...this.data];

    // Apply search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    // Apply filters
    Object.entries(this.filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sort
    if (this.sort.column) {
      result.sort((a, b) => {
        const aValue = a[this.sort.column];
        const bValue = b[this.sort.column];
        const direction = this.sort.direction === 'asc' ? 1 : -1;
        
        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
      });
    }

    return result;
  }

  get paginatedData(): any[] {
    const start = (this.pagination.page - 1) * this.pagination.pageSize;
    const end = start + this.pagination.pageSize;
    return this.filteredData.slice(start, end);
  }

  onSearch(): void {
    this.pagination.page = 1;
    this.filterChange.emit(
      Object.entries(this.filters).map(([column, value]) => ({ column, value }))
    );
  }

  onFilter(): void {
    this.pagination.page = 1;
    this.filterChange.emit(
      Object.entries(this.filters).map(([column, value]) => ({ column, value }))
    );
  }

  sortBy(column: string): void {
    if (this.sort.column === column) {
      this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort = { column, direction: 'asc' };
    }
    this.sortChange.emit(this.sort);
  }

  getSortIcon(column: string): string {
    if (this.sort.column !== column) return 'fas fa-sort';
    return this.sort.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  toggleColumn(key: string): void {
    if (this.hiddenColumns.has(key)) {
      this.hiddenColumns.delete(key);
    } else {
      this.hiddenColumns.add(key);
    }
  }

  isColumnHidden(key: string): boolean {
    return this.hiddenColumns.has(key);
  }

  toggleColumnMenu(): void {
    this.showColumnMenu = !this.showColumnMenu;
  }

  toggleRow(row: any): void {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selectedRows.clear();
    } else {
      this.paginatedData.forEach(row => this.selectedRows.add(row));
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  isSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }

  isAllSelected(): boolean {
    return this.paginatedData.length > 0 &&
           this.paginatedData.every(row => this.selectedRows.has(row));
  }

  previousPage(): void {
    if (this.pagination.page > 1) {
      this.pagination.page--;
      this.pageChange.emit(this.pagination);
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.pagination.page++;
      this.pageChange.emit(this.pagination);
    }
  }

  onPageSizeChange(): void {
    this.pagination.page = 1;
    this.pageChange.emit(this.pagination);
  }

  hasNextPage(): boolean {
    return this.getEndIndex() < this.filteredData.length;
  }

  getStartIndex(): number {
    return (this.pagination.page - 1) * this.pagination.pageSize;
  }

  getEndIndex(): number {
    return Math.min(
      this.getStartIndex() + this.pagination.pageSize,
      this.filteredData.length
    );
  }

  getColumnHeaderClasses(column: TableColumn): string {
    return `
      px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
      ${column.sortable ? 'cursor-pointer' : ''}
      ${column.align === 'center' ? 'text-center' : ''}
      ${column.align === 'right' ? 'text-right' : ''}
    `.trim();
  }

  getColumnClasses(column: TableColumn): string {
    return `
      px-6 py-4 whitespace-nowrap text-sm text-gray-900
      ${column.align === 'center' ? 'text-center' : ''}
      ${column.align === 'right' ? 'text-right' : ''}
    `.trim();
  }

  formatCellValue(value: any, column: TableColumn): string {
    if (value === null || value === undefined) return '';
    if (column.format) return column.format(value);

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  }

  exportData(): void {
    const headers = this.visibleColumns.map(column => column.label);
    const rows = this.filteredData.map(row =>
      this.visibleColumns.map(column => this.formatCellValue(row[column.key], column))
    );

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}