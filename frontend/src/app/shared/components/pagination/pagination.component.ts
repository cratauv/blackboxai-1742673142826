import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <nav 
        class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6" 
        aria-label="Pagination"
      >
        <!-- Mobile View -->
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            [disabled]="currentPage === 1"
            (click)="onPageChange(currentPage - 1)"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            [class.opacity-50]="currentPage === 1"
          >
            Previous
          </button>
          <button
            [disabled]="currentPage === totalPages"
            (click)="onPageChange(currentPage + 1)"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            [class.opacity-50]="currentPage === totalPages"
          >
            Next
          </button>
        </div>

        <!-- Desktop View -->
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <!-- Results Info -->
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startItem }}</span>
              to
              <span class="font-medium">{{ endItem }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>

          <!-- Page Numbers -->
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <!-- Previous Button -->
              <button
                [disabled]="currentPage === 1"
                (click)="onPageChange(currentPage - 1)"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                [class.opacity-50]="currentPage === 1"
              >
                <span class="sr-only">Previous</span>
                <i class="fas fa-chevron-left h-5 w-5"></i>
              </button>

              <!-- First Page -->
              @if (showFirstPage) {
                <button
                  (click)="onPageChange(1)"
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold"
                  [class.text-white]="currentPage === 1"
                  [class.bg-primary-600]="currentPage === 1"
                  [class.text-gray-900]="currentPage !== 1"
                  [class.ring-1]="currentPage !== 1"
                  [class.ring-inset]="currentPage !== 1"
                  [class.ring-gray-300]="currentPage !== 1"
                  [class.hover:bg-gray-50]="currentPage !== 1"
                >
                  1
                </button>

                @if (!isFirstPageInRange) {
                  <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    ...
                  </span>
                }
              }

              <!-- Page Numbers -->
              @for (page of visiblePages; track page) {
                <button
                  (click)="onPageChange(page)"
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold"
                  [class.text-white]="currentPage === page"
                  [class.bg-primary-600]="currentPage === page"
                  [class.text-gray-900]="currentPage !== page"
                  [class.ring-1]="currentPage !== page"
                  [class.ring-inset]="currentPage !== page"
                  [class.ring-gray-300]="currentPage !== page"
                  [class.hover:bg-gray-50]="currentPage !== page"
                >
                  {{ page }}
                </button>
              }

              <!-- Last Page -->
              @if (showLastPage) {
                @if (!isLastPageInRange) {
                  <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    ...
                  </span>
                }

                <button
                  (click)="onPageChange(totalPages)"
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold"
                  [class.text-white]="currentPage === totalPages"
                  [class.bg-primary-600]="currentPage === totalPages"
                  [class.text-gray-900]="currentPage !== totalPages"
                  [class.ring-1]="currentPage !== totalPages"
                  [class.ring-inset]="currentPage !== totalPages"
                  [class.ring-gray-300]="currentPage !== totalPages"
                  [class.hover:bg-gray-50]="currentPage !== totalPages"
                >
                  {{ totalPages }}
                </button>
              }

              <!-- Next Button -->
              <button
                [disabled]="currentPage === totalPages"
                (click)="onPageChange(currentPage + 1)"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                [class.opacity-50]="currentPage === totalPages"
              >
                <span class="sr-only">Next</span>
                <i class="fas fa-chevron-right h-5 w-5"></i>
              </button>
            </nav>
          </div>
        </div>
      </nav>
    }
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<number>();

  readonly maxVisiblePages = 5;

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalItems ? this.totalItems : end;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    let start = Math.max(2, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    let end = Math.min(this.totalPages - 1, start + this.maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end === this.totalPages - 1) {
      start = Math.max(2, end - this.maxVisiblePages + 2);
    }

    // Generate page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  get showFirstPage(): boolean {
    return this.totalPages > 1;
  }

  get showLastPage(): boolean {
    return this.totalPages > 1 && this.totalPages !== 2;
  }

  get isFirstPageInRange(): boolean {
    return this.visiblePages.includes(2);
  }

  get isLastPageInRange(): boolean {
    return this.visiblePages.includes(this.totalPages - 1);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}