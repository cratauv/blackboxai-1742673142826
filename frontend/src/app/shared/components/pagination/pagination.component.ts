import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0"
      aria-label="Pagination"
    >
      <!-- Mobile View -->
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          type="button"
          [disabled]="currentPage === 1"
          [class]="getMobileButtonClasses(true)"
          (click)="onPageChange(currentPage - 1)"
        >
          Previous
        </button>
        <button
          type="button"
          [disabled]="currentPage === totalPages"
          [class]="getMobileButtonClasses(false)"
          (click)="onPageChange(currentPage + 1)"
        >
          Next
        </button>
      </div>

      <!-- Desktop View -->
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <!-- Page Information -->
        @if (showInfo) {
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>
        }

        <!-- Page Numbers -->
        <div>
          <div class="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <!-- Previous Button -->
            <button
              type="button"
              [disabled]="currentPage === 1"
              [class]="getNavigationButtonClasses(true)"
              (click)="onPageChange(currentPage - 1)"
            >
              <span class="sr-only">Previous</span>
              <i class="fas fa-chevron-left h-5 w-5"></i>
            </button>

            <!-- First Page -->
            @if (showFirstLast && currentPage > 3) {
              <button
                type="button"
                [class]="getPageButtonClasses(1)"
                (click)="onPageChange(1)"
              >
                1
              </button>
              @if (currentPage > 4) {
                <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                  ...
                </span>
              }
            }

            <!-- Page Numbers -->
            @for (page of visiblePages; track page) {
              <button
                type="button"
                [class]="getPageButtonClasses(page)"
                (click)="onPageChange(page)"
              >
                {{ page }}
              </button>
            }

            <!-- Last Page -->
            @if (showFirstLast && currentPage < totalPages - 2) {
              @if (currentPage < totalPages - 3) {
                <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                  ...
                </span>
              }
              <button
                type="button"
                [class]="getPageButtonClasses(totalPages)"
                (click)="onPageChange(totalPages)"
              >
                {{ totalPages }}
              </button>
            }

            <!-- Next Button -->
            <button
              type="button"
              [disabled]="currentPage === totalPages"
              [class]="getNavigationButtonClasses(false)"
              (click)="onPageChange(currentPage + 1)"
            >
              <span class="sr-only">Next</span>
              <i class="fas fa-chevron-right h-5 w-5"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() showFirstLast = true;
  @Input() showInfo = true;
  @Input() maxVisiblePages = 5;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    let start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getMobileButtonClasses(isPrevious: boolean): string {
    const baseClasses = 'relative inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold';
    const enabledClasses = 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50';
    const disabledClasses = 'text-gray-400 cursor-not-allowed';

    const isDisabled = isPrevious ? this.currentPage === 1 : this.currentPage === this.totalPages;

    return `${baseClasses} ${isDisabled ? disabledClasses : enabledClasses}`;
  }

  getNavigationButtonClasses(isPrevious: boolean): string {
    const baseClasses = 'relative inline-flex items-center px-2 py-2 text-sm font-semibold';
    const enabledClasses = 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50';
    const disabledClasses = 'text-gray-400 cursor-not-allowed';

    const isDisabled = isPrevious ? this.currentPage === 1 : this.currentPage === this.totalPages;
    const roundedClasses = isPrevious ? 'rounded-l-md' : 'rounded-r-md';

    return `${baseClasses} ${isDisabled ? disabledClasses : enabledClasses} ${roundedClasses}`;
  }

  getPageButtonClasses(page: number): string {
    const baseClasses = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold';
    const activeClasses = 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600';
    const inactiveClasses = 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0';

    return `${baseClasses} ${page === this.currentPage ? activeClasses : inactiveClasses}`;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  // Helper method to set current page
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Helper method to set page size
  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  // Helper method to set total items
  setTotalItems(total: number): void {
    this.totalItems = total;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  // Helper method to go to first page
  goToFirstPage(): void {
    this.onPageChange(1);
  }

  // Helper method to go to last page
  goToLastPage(): void {
    this.onPageChange(this.totalPages);
  }

  // Helper method to go to next page
  goToNextPage(): void {
    this.onPageChange(this.currentPage + 1);
  }

  // Helper method to go to previous page
  goToPreviousPage(): void {
    this.onPageChange(this.currentPage - 1);
  }

  // Helper method to check if current page is first page
  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  // Helper method to check if current page is last page
  isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  // Helper method to get current page info
  getPageInfo(): { start: number; end: number; total: number } {
    return {
      start: this.startIndex + 1,
      end: this.endIndex,
      total: this.totalItems
    };
  }
}