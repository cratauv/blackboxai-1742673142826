import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type SnackbarType = 'default' | 'success' | 'error' | 'warning' | 'info';
type SnackbarPosition = 'top' | 'bottom';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed z-50 pointer-events-none"
      [class]="getContainerClasses()"
    >
      <div
        class="flex max-w-sm w-full mx-auto pointer-events-auto overflow-hidden"
        [class]="getSnackbarClasses()"
        [@slideInOut]="isVisible"
        role="alert"
        aria-live="assertive"
      >
        <div class="flex-1 p-4">
          <div class="flex items-start">
            <!-- Icon -->
            @if (showIcon) {
              <div class="flex-shrink-0">
                @switch (type) {
                  @case ('success') {
                    <i class="fas fa-check-circle text-green-400 text-lg"></i>
                  }
                  @case ('error') {
                    <i class="fas fa-times-circle text-red-400 text-lg"></i>
                  }
                  @case ('warning') {
                    <i class="fas fa-exclamation-circle text-yellow-400 text-lg"></i>
                  }
                  @case ('info') {
                    <i class="fas fa-info-circle text-blue-400 text-lg"></i>
                  }
                }
              </div>
            }

            <!-- Content -->
            <div [class]="showIcon ? 'ml-3' : ''">
              <p class="text-sm font-medium text-gray-900">
                {{ message }}
              </p>
              @if (description) {
                <p class="mt-1 text-sm text-gray-500">
                  {{ description }}
                </p>
              }
            </div>
          </div>
        </div>

        <!-- Action Button -->
        @if (action) {
          <div class="flex border-l border-gray-200">
            <button
              type="button"
              class="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
              [class]="getActionButtonClasses()"
              (click)="onAction()"
            >
              {{ action }}
            </button>
          </div>
        }

        <!-- Close Button -->
        @if (dismissible) {
          <div class="flex border-l border-gray-200">
            <button
              type="button"
              class="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              (click)="dismiss()"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        }

        <!-- Progress Bar -->
        @if (duration > 0) {
          <div
            class="absolute bottom-0 left-0 h-1 bg-primary-500"
            [style.width.%]="progressWidth"
            [style.transition]="'width ' + duration + 'ms linear'"
          ></div>
        }
      </div>
    </div>
  `,
  animations: [
    trigger('slideInOut', [
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
  @Input() isVisible = false;
  @Input() message = '';
  @Input() description = '';
  @Input() type: SnackbarType = 'default';
  @Input() position: SnackbarPosition = 'bottom';
  @Input() duration = 5000;
  @Input() action = '';
  @Input() dismissible = true;
  @Input() showIcon = true;

  @Output() dismissed = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<void>();

  progressWidth = 100;
  private progressTimer?: number;
  private dismissTimer?: number;

  ngOnChanges(): void {
    if (this.isVisible) {
      this.show();
    } else {
      this.hide();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private show(): void {
    this.clearTimers();
    this.progressWidth = 100;

    if (this.duration > 0) {
      // Start progress bar animation
      requestAnimationFrame(() => {
        this.progressWidth = 0;
      });

      // Set dismiss timer
      this.dismissTimer = window.setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
  }

  private hide(): void {
    this.clearTimers();
  }

  private clearTimers(): void {
    if (this.progressTimer) {
      clearTimeout(this.progressTimer);
    }
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
    }
  }

  getContainerClasses(): string {
    const positions = {
      top: 'top-0 pt-4',
      bottom: 'bottom-0 pb-4'
    };

    return `
      left-0 right-0
      ${positions[this.position]}
    `;
  }

  getSnackbarClasses(): string {
    const typeClasses = {
      default: 'bg-white',
      success: 'bg-green-50',
      error: 'bg-red-50',
      warning: 'bg-yellow-50',
      info: 'bg-blue-50'
    };

    return `
      ${typeClasses[this.type]}
      rounded-lg
      shadow-lg
      relative
    `;
  }

  getActionButtonClasses(): string {
    const typeClasses = {
      default: 'text-primary-600 hover:text-primary-500',
      success: 'text-green-600 hover:text-green-500',
      error: 'text-red-600 hover:text-red-500',
      warning: 'text-yellow-600 hover:text-yellow-500',
      info: 'text-blue-600 hover:text-blue-500'
    };

    return typeClasses[this.type];
  }

  dismiss(): void {
    this.clearTimers();
    this.dismissed.emit();
  }

  onAction(): void {
    this.actionClicked.emit();
    this.dismiss();
  }

  // Helper method to show snackbar
  show(): void {
    this.isVisible = true;
  }

  // Helper method to set message
  setMessage(message: string, description?: string): void {
    this.message = message;
    this.description = description || '';
  }

  // Helper method to set type
  setType(type: SnackbarType): void {
    this.type = type;
  }

  // Helper method to set position
  setPosition(position: SnackbarPosition): void {
    this.position = position;
  }

  // Helper method to set duration
  setDuration(duration: number): void {
    this.duration = duration;
  }

  // Helper method to set action
  setAction(action: string): void {
    this.action = action;
  }

  // Helper method to toggle dismissible
  toggleDismissible(dismissible: boolean): void {
    this.dismissible = dismissible;
  }

  // Helper method to toggle icon
  toggleIcon(showIcon: boolean): void {
    this.showIcon = showIcon;
  }

  // Helper method to check if visible
  isShown(): boolean {
    return this.isVisible;
  }

  // Helper method to get remaining time
  getRemainingTime(): number {
    if (!this.dismissTimer) return 0;
    return Math.max(0, this.duration - (Date.now() - this.dismissTimer));
  }

  // Helper method to pause timer
  pause(): void {
    this.clearTimers();
  }

  // Helper method to resume timer
  resume(): void {
    if (this.duration > 0) {
      const remaining = this.getRemainingTime();
      if (remaining > 0) {
        this.duration = remaining;
        this.show();
      }
    }
  }

  // Helper method to get color scheme
  getColorScheme(): { background: string; text: string; action: string } {
    return {
      background: this.getSnackbarClasses().match(/bg-\w+-\d+/)?.[0] || '',
      text: 'text-gray-900',
      action: this.getActionButtonClasses()
    };
  }
}