import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black transition-opacity"
          [class.bg-opacity-75]="!loading"
          [class.bg-opacity-90]="loading"
          (click)="onBackdropClick()"
        ></div>

        <!-- Dialog Panel -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            class="relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
            [class]="getDialogClasses()"
            (click)="$event.stopPropagation()"
          >
            <!-- Loading State -->
            @if (loading) {
              <div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
              </div>
            }

            <!-- Header -->
            @if (showHeader) {
              <div class="px-4 py-3 border-b border-gray-200 sm:px-6">
                <div class="flex items-center justify-between">
                  <h3
                    [id]="titleId"
                    class="text-lg font-medium text-gray-900"
                  >
                    {{ title }}
                  </h3>
                  @if (showCloseButton) {
                    <button
                      type="button"
                      class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      (click)="close()"
                    >
                      <span class="sr-only">Close</span>
                      <i class="fas fa-times"></i>
                    </button>
                  }
                </div>
                @if (subtitle) {
                  <p class="mt-1 text-sm text-gray-500">
                    {{ subtitle }}
                  </p>
                }
              </div>
            }

            <!-- Body -->
            <div [class]="getBodyClasses()">
              <ng-content></ng-content>
            </div>

            <!-- Footer -->
            @if (showFooter) {
              <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
                <div class="flex justify-end space-x-3">
                  @if (showCancelButton) {
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      (click)="cancel()"
                    >
                      {{ cancelText }}
                    </button>
                  }
                  @if (showConfirmButton) {
                    <button
                      type="button"
                      [class]="getConfirmButtonClasses()"
                      [disabled]="confirmDisabled"
                      (click)="confirm()"
                    >
                      @if (confirmLoading) {
                        <i class="fas fa-spinner fa-spin mr-2"></i>
                      }
                      {{ confirmText }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class DialogComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() size: DialogSize = 'md';
  @Input() loading = false;
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showCloseButton = true;
  @Input() showCancelButton = true;
  @Input() showConfirmButton = true;
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';
  @Input() confirmDisabled = false;
  @Input() confirmLoading = false;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  @Input() preventScroll = true;

  @Output() closed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  titleId = `dialog-title-${Math.random().toString(36).substr(2, 9)}`;

  getDialogClasses(): string {
    const sizeClasses = {
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      full: 'sm:max-w-full sm:m-4'
    };

    return sizeClasses[this.size];
  }

  getBodyClasses(): string {
    return `
      px-4 py-5 sm:p-6
      ${this.loading ? 'opacity-50' : ''}
      ${this.size === 'full' ? 'h-[calc(100vh-16rem)]' : ''}
      ${this.size === 'full' ? 'overflow-auto' : ''}
    `;
  }

  getConfirmButtonClasses(): string {
    return `
      inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm
      ${this.confirmDisabled || this.confirmLoading
        ? 'bg-primary-400 cursor-not-allowed'
        : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      }
    `;
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop && !this.loading) {
      this.close();
    }
  }

  close(): void {
    if (!this.loading) {
      this.isOpen = false;
      this.closed.emit();
    }
  }

  cancel(): void {
    if (!this.loading) {
      this.cancelled.emit();
      this.close();
    }
  }

  confirm(): void {
    if (!this.loading && !this.confirmDisabled && !this.confirmLoading) {
      this.confirmed.emit();
    }
  }

  // Helper method to open dialog
  open(): void {
    this.isOpen = true;
    if (this.preventScroll) {
      document.body.style.overflow = 'hidden';
    }
  }

  // Helper method to set title
  setTitle(title: string, subtitle?: string): void {
    this.title = title;
    if (subtitle) {
      this.subtitle = subtitle;
    }
  }

  // Helper method to set size
  setSize(size: DialogSize): void {
    this.size = size;
  }

  // Helper method to set loading state
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  // Helper method to set confirm button state
  setConfirmState(disabled: boolean, loading: boolean = false): void {
    this.confirmDisabled = disabled;
    this.confirmLoading = loading;
  }

  // Helper method to set button text
  setButtonText(confirm?: string, cancel?: string): void {
    if (confirm) this.confirmText = confirm;
    if (cancel) this.cancelText = cancel;
  }

  // Helper method to toggle header
  toggleHeader(show: boolean): void {
    this.showHeader = show;
  }

  // Helper method to toggle footer
  toggleFooter(show: boolean): void {
    this.showFooter = show;
  }

  // Helper method to toggle buttons
  toggleButtons(showConfirm: boolean, showCancel: boolean): void {
    this.showConfirmButton = showConfirm;
    this.showCancelButton = showCancel;
  }

  // Helper method to check if dialog is open
  isShown(): boolean {
    return this.isOpen;
  }

  // Helper method to check if dialog can be closed
  canClose(): boolean {
    return !this.loading;
  }
}