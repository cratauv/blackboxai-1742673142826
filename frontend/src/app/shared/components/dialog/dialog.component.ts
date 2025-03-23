import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 overflow-y-auto"
      [class.hidden]="!isOpen"
      role="dialog"
      aria-modal="true"
      #dialogContainer
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black transition-opacity"
        [class.bg-opacity-50]="!loading"
        [class.bg-opacity-75]="loading"
        [@fadeInOut]="isOpen"
        (click)="onBackdropClick()"
      ></div>

      <!-- Dialog Panel -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
          [class]="getDialogClasses()"
          [@slideInOut]="isOpen"
          #dialogPanel
        >
          <!-- Loading State -->
          @if (loading) {
            <div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          }

          <!-- Header -->
          @if (title || showCloseButton) {
            <div class="flex items-center justify-between px-6 py-4 border-b">
              <h3 class="text-lg font-medium text-gray-900">
                {{ title }}
              </h3>
              @if (showCloseButton) {
                <button
                  type="button"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  (click)="close()"
                >
                  <i class="fas fa-times"></i>
                </button>
              }
            </div>
          }

          <!-- Content -->
          <div [class]="getContentClasses()">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (showFooter) {
            <div class="flex items-center justify-end px-6 py-4 border-t space-x-2">
              @if (showCancelButton) {
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  [disabled]="loading"
                  (click)="cancel()"
                >
                  {{ cancelText }}
                </button>
              }
              @if (showConfirmButton) {
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  [disabled]="loading"
                  (click)="confirm()"
                >
                  {{ confirmText }}
                </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'scale(0.95)', opacity: 0 }))
      ])
    ])
  ]
})
export class DialogComponent {
  @ViewChild('dialogContainer') dialogContainer!: ElementRef;
  @ViewChild('dialogPanel') dialogPanel!: ElementRef;

  @Input() isOpen = false;
  @Input() size: DialogSize = 'md';
  @Input() title = '';
  @Input() loading = false;
  @Input() showCloseButton = true;
  @Input() showFooter = true;
  @Input() showCancelButton = true;
  @Input() showConfirmButton = true;
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  @Input() preventScroll = true;

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  private readonly sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  ngOnInit(): void {
    if (this.closeOnEscape) {
      document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (this.closeOnEscape) {
      document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  private handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  private onOpen(): void {
    if (this.preventScroll) {
      document.body.style.overflow = 'hidden';
    }
    this.opened.emit();
  }

  private onClose(): void {
    if (this.preventScroll) {
      document.body.style.overflow = '';
    }
    this.closed.emit();
  }

  getDialogClasses(): string {
    return this.sizeMap[this.size];
  }

  getContentClasses(): string {
    return `
      px-6 py-4
      ${this.loading ? 'opacity-50' : ''}
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
      this.onClose();
    }
  }

  cancel(): void {
    if (!this.loading) {
      this.cancelled.emit();
      this.close();
    }
  }

  confirm(): void {
    if (!this.loading) {
      this.confirmed.emit();
      this.close();
    }
  }

  // Helper method to open dialog
  open(): void {
    this.isOpen = true;
    this.onOpen();
  }

  // Helper method to set loading state
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  // Helper method to set size
  setSize(size: DialogSize): void {
    this.size = size;
  }

  // Helper method to set title
  setTitle(title: string): void {
    this.title = title;
  }

  // Helper method to set button text
  setButtonText(cancel: string, confirm: string): void {
    this.cancelText = cancel;
    this.confirmText = confirm;
  }

  // Helper method to toggle buttons
  toggleButtons(showCancel: boolean, showConfirm: boolean): void {
    this.showCancelButton = showCancel;
    this.showConfirmButton = showConfirm;
  }

  // Helper method to check if dialog is open
  isDialogOpen(): boolean {
    return this.isOpen;
  }

  // Helper method to get dialog dimensions
  getDimensions(): { width: string; maxWidth: string } {
    const panel = this.dialogPanel?.nativeElement;
    return panel ? {
      width: window.getComputedStyle(panel).width,
      maxWidth: window.getComputedStyle(panel).maxWidth
    } : { width: '0', maxWidth: '0' };
  }

  // Helper method to focus first focusable element
  focusFirst(): void {
    const focusable = this.dialogPanel?.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable?.length) {
      (focusable[0] as HTMLElement).focus();
    }
  }

  // Helper method to focus last focusable element
  focusLast(): void {
    const focusable = this.dialogPanel?.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable?.length) {
      (focusable[focusable.length - 1] as HTMLElement).focus();
    }
  }
}