import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type SnackbarType = 'info' | 'success' | 'warning' | 'error';
type SnackbarPosition = 'top' | 'bottom';
type SnackbarAlignment = 'left' | 'center' | 'right';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
      <div
        class="fixed z-50 pointer-events-none"
        [class]="getPositionClasses()"
      >
        <div
          class="flex max-w-sm w-full mx-auto pointer-events-auto overflow-hidden"
          [class]="getContainerClasses()"
          [@snackbarAnimation]
          role="alert"
          aria-live="assertive"
        >
          <div class="flex-1 p-4">
            <div class="flex items-start">
              <!-- Icon -->
              @if (showIcon) {
                <div class="flex-shrink-0">
                  <i [class]="getIconClasses()"></i>
                </div>
              }

              <!-- Content -->
              <div [class]="showIcon ? 'ml-3 w-0 flex-1' : 'w-full'">
                <!-- Title -->
                @if (title) {
                  <p 
                    class="text-sm font-medium"
                    [class]="getTitleClasses()"
                  >
                    {{ title }}
                  </p>
                }

                <!-- Message -->
                <p 
                  [class.mt-1]="title"
                  class="text-sm"
                  [class]="getMessageClasses()"
                >
                  {{ message }}
                </p>

                <!-- Action Button -->
                @if (actionLabel) {
                  <div class="mt-3">
                    <button
                      type="button"
                      class="text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                      [class]="getActionButtonClasses()"
                      (click)="onAction()"
                    >
                      {{ actionLabel }}
                    </button>
                  </div>
                }
              </div>

              <!-- Close Button -->
              @if (dismissible) {
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    type="button"
                    class="rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2"
                    [class]="getCloseButtonClasses()"
                    (click)="dismiss()"
                  >
                    <span class="sr-only">Close</span>
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  animations: [
    trigger('snackbarAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('150ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class SnackbarComponent {
  @Input() type: SnackbarType = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() position: SnackbarPosition = 'bottom';
  @Input() alignment: SnackbarAlignment = 'center';
  @Input() duration = 5000;
  @Input() showIcon = true;
  @Input() dismissible = true;
  @Input() actionLabel = '';
  @Input() isVisible = false;

  @Output() dismissed = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();

  private timeoutId?: number;

  ngOnInit(): void {
    if (this.duration > 0) {
      this.startDismissTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearDismissTimer();
  }

  getPositionClasses(): string {
    const positions = {
      top: 'top-0 pt-4',
      bottom: 'bottom-0 pb-4'
    };

    const alignments = {
      left: 'left-0 pl-4',
      center: 'left-1/2 transform -translate-x-1/2',
      right: 'right-0 pr-4'
    };

    return `${positions[this.position]} ${alignments[this.alignment]}`;
  }

  getContainerClasses(): string {
    const baseClasses = 'rounded-lg shadow-lg';
    
    const types = {
      info: 'bg-blue-50 border border-blue-200',
      success: 'bg-green-50 border border-green-200',
      warning: 'bg-yellow-50 border border-yellow-200',
      error: 'bg-red-50 border border-red-200'
    };

    return `${baseClasses} ${types[this.type]}`;
  }

  getIconClasses(): string {
    const baseClasses = 'h-5 w-5';
    
    const icons = {
      info: 'fas fa-info-circle text-blue-400',
      success: 'fas fa-check-circle text-green-400',
      warning: 'fas fa-exclamation-triangle text-yellow-400',
      error: 'fas fa-exclamation-circle text-red-400'
    };

    return `${baseClasses} ${icons[this.type]}`;
  }

  getTitleClasses(): string {
    const colors = {
      info: 'text-blue-800',
      success: 'text-green-800',
      warning: 'text-yellow-800',
      error: 'text-red-800'
    };
    return colors[this.type];
  }

  getMessageClasses(): string {
    const colors = {
      info: 'text-blue-700',
      success: 'text-green-700',
      warning: 'text-yellow-700',
      error: 'text-red-700'
    };
    return colors[this.type];
  }

  getActionButtonClasses(): string {
    const colors = {
      info: 'text-blue-600 hover:text-blue-500 focus:ring-blue-500',
      success: 'text-green-600 hover:text-green-500 focus:ring-green-500',
      warning: 'text-yellow-600 hover:text-yellow-500 focus:ring-yellow-500',
      error: 'text-red-600 hover:text-red-500 focus:ring-red-500'
    };
    return colors[this.type];
  }

  getCloseButtonClasses(): string {
    const colors = {
      info: 'text-blue-400 hover:text-blue-500',
      success: 'text-green-400 hover:text-green-500',
      warning: 'text-yellow-400 hover:text-yellow-500',
      error: 'text-red-400 hover:text-red-500'
    };
    return colors[this.type];
  }

  dismiss(): void {
    this.clearDismissTimer();
    this.isVisible = false;
    this.dismissed.emit();
  }

  onAction(): void {
    this.clearDismissTimer();
    this.action.emit();
  }

  private startDismissTimer(): void {
    this.timeoutId = window.setTimeout(() => {
      this.dismiss();
    }, this.duration);
  }

  private clearDismissTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  // Helper method to show snackbar
  show(): void {
    this.isVisible = true;
    if (this.duration > 0) {
      this.startDismissTimer();
    }
  }

  // Helper method to get animation duration
  getAnimationDuration(): number {
    return 150; // milliseconds
  }

  // Helper method to get z-index
  getZIndex(): number {
    return 50;
  }

  // Helper method to get background color
  getBgColor(): string {
    const colors = {
      info: '#EFF6FF',
      success: '#ECFDF5',
      warning: '#FFFBEB',
      error: '#FEF2F2'
    };
    return colors[this.type];
  }

  // Helper method to get border color
  getBorderColor(): string {
    const colors = {
      info: '#BFDBFE',
      success: '#A7F3D0',
      warning: '#FDE68A',
      error: '#FECACA'
    };
    return colors[this.type];
  }
}