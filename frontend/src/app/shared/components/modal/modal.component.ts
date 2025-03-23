import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        (click)="closeOnBackdrop && close()"
        @fadeAnimation
      ></div>

      <!-- Modal -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @slideAnimation
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-lg"
          [class.max-w-xl]="size === 'lg'"
          [class.max-w-md]="size === 'sm'"
        >
          <!-- Header -->
          @if (showHeader) {
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
              @if (showCloseButton) {
                <button
                  (click)="close()"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  aria-label="Close modal"
                >
                  <i class="fas fa-times text-xl"></i>
                </button>
              }
            </div>
          }

          <!-- Content -->
          <div
            class="p-4"
            [class.pt-4]="!showHeader"
            [ngClass]="contentClass"
          >
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (showFooter) {
            <div class="flex justify-end gap-3 p-4 border-t border-gray-200">
              @if (showCancelButton) {
                <app-button
                  variant="outline"
                  (buttonClick)="cancel()"
                >
                  {{ cancelText }}
                </app-button>
              }
              
              @if (showConfirmButton) {
                <app-button
                  [variant]="confirmButtonVariant"
                  (buttonClick)="confirm()"
                  [loading]="loading"
                >
                  {{ confirmText }}
                </app-button>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ],
  styles: [`
    :host {
      display: block;
    }

    /* Prevent body scroll when modal is open */
    :host-context(body.modal-open) {
      overflow: hidden;
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showCloseButton = true;
  @Input() showCancelButton = true;
  @Input() showConfirmButton = true;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  @Input() contentClass = '';
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';
  @Input() confirmButtonVariant: 'primary' | 'danger' | 'success' = 'primary';
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  constructor() {
    // Handle escape key
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (this.isOpen && this.closeOnEscape && event.key === 'Escape') {
          this.close();
        }
      });
    }
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
    this.enableBodyScroll();
  }

  cancel(): void {
    this.cancelled.emit();
    this.close();
  }

  confirm(): void {
    this.confirmed.emit();
    if (!this.loading) {
      this.close();
    }
  }

  private disableBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.add('modal-open');
    }
  }

  private enableBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  }

  // Watch for changes in isOpen
  ngOnChanges(): void {
    if (this.isOpen) {
      this.disableBodyScroll();
    } else {
      this.enableBodyScroll();
    }
  }

  // Cleanup
  ngOnDestroy(): void {
    this.enableBodyScroll();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', () => {});
    }
  }
}