import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type DialogType = 'default' | 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        [class.animate-fade-in]="isOpen"
        (click)="onBackdropClick()"
      ></div>

      <!-- Dialog Panel -->
      <div
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
      >
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
            [class]="getDialogSizeClasses()"
            [@dialogAnimation]
          >
            <!-- Close Button -->
            @if (showCloseButton) {
              <button
                type="button"
                class="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                (click)="close()"
              >
                <span class="sr-only">Close</span>
                <i class="fas fa-times text-xl"></i>
              </button>
            }

            <!-- Dialog Header -->
            @if (showHeader) {
              <div 
                class="px-6 py-4 border-b"
                [class]="getHeaderClasses()"
              >
                <div class="flex items-center">
                  @if (icon) {
                    <i 
                      [class]="icon"
                      class="mr-3 text-2xl"
                      [class]="getIconClasses()"
                    ></i>
                  }
                  <h3 
                    [id]="titleId" 
                    class="text-lg font-semibold"
                    [class]="getTitleClasses()"
                  >
                    {{ title }}
                  </h3>
                </div>
                @if (subtitle) {
                  <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
                }
              </div>
            }

            <!-- Dialog Content -->
            <div 
              class="px-6 py-4"
              [class.pt-4]="!showHeader"
              [class]="getContentClasses()"
            >
              <ng-content></ng-content>
            </div>

            <!-- Dialog Footer -->
            @if (showFooter) {
              <div class="px-6 py-4 border-t bg-gray-50">
                <div class="flex justify-end space-x-3">
                  @if (showCancelButton) {
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      (click)="cancel()"
                    >
                      {{ cancelText }}
                    </button>
                  }
                  @if (showConfirmButton) {
                    <button
                      type="button"
                      [class]="getConfirmButtonClasses()"
                      (click)="confirm()"
                      [disabled]="loading"
                    >
                      @if (loading) {
                        <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
  `,
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ],
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class DialogComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() size: DialogSize = 'md';
  @Input() type: DialogType = 'default';
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showCloseButton = true;
  @Input() showCancelButton = true;
  @Input() showConfirmButton = true;
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  titleId = `dialog-title-${Math.random().toString(36).substr(2, 9)}`;

  getDialogSizeClasses(): string {
    const sizes = {
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      full: 'sm:max-w-full sm:m-4'
    };
    return `w-full ${sizes[this.size]}`;
  }

  getHeaderClasses(): string {
    const types = {
      default: 'bg-white',
      info: 'bg-blue-50',
      success: 'bg-green-50',
      warning: 'bg-yellow-50',
      danger: 'bg-red-50'
    };
    return types[this.type];
  }

  getIconClasses(): string {
    const types = {
      default: 'text-gray-400',
      info: 'text-blue-400',
      success: 'text-green-400',
      warning: 'text-yellow-400',
      danger: 'text-red-400'
    };
    return types[this.type];
  }

  getTitleClasses(): string {
    const types = {
      default: 'text-gray-900',
      info: 'text-blue-900',
      success: 'text-green-900',
      warning: 'text-yellow-900',
      danger: 'text-red-900'
    };
    return types[this.type];
  }

  getContentClasses(): string {
    return this.type === 'default' ? '' : `bg-${this.type}-50`;
  }

  getConfirmButtonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const types = {
      default: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
      info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    };

    return `${baseClasses} ${types[this.type]}`;
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
    this.close();
  }

  confirm(): void {
    if (!this.loading) {
      this.confirmed.emit();
      if (!this.loading) {
        this.close();
      }
    }
  }

  // Helper method to get dialog width
  getDialogWidth(): string {
    const widths = {
      sm: '384px',
      md: '448px',
      lg: '512px',
      xl: '576px',
      full: '100%'
    };
    return widths[this.size];
  }

  // Helper method to get dialog max height
  getDialogMaxHeight(): string {
    return this.size === 'full' ? '100vh' : '90vh';
  }

  // Helper method to get animation duration
  getAnimationDuration(): number {
    return 150; // milliseconds
  }

  // Helper method to check if dialog is full screen
  isFullScreen(): boolean {
    return this.size === 'full';
  }

  // Helper method to get ARIA role
  getAriaRole(): string {
    const roles = {
      default: 'dialog',
      info: 'alertdialog',
      success: 'alertdialog',
      warning: 'alertdialog',
      danger: 'alertdialog'
    };
    return roles[this.type];
  }
}