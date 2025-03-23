import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed z-50"
      [class]="getContainerPosition()"
      aria-live="polite"
    >
      <!-- Toast Stack -->
      <div class="space-y-2 p-4">
        @for (toast of toasts; track toast.id) {
          <div
            class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto"
            [@toastAnimation]="getAnimationState(toast)"
            (@toastAnimation.done)="onAnimationDone($event, toast)"
          >
            <div class="p-4">
              <div class="flex items-start">
                <!-- Icon -->
                <div class="flex-shrink-0">
                  @switch (toast.type) {
                    @case ('success') {
                      <i class="fas fa-check-circle text-green-500 text-lg"></i>
                    }
                    @case ('error') {
                      <i class="fas fa-times-circle text-red-500 text-lg"></i>
                    }
                    @case ('warning') {
                      <i class="fas fa-exclamation-circle text-yellow-500 text-lg"></i>
                    }
                    @case ('info') {
                      <i class="fas fa-info-circle text-blue-500 text-lg"></i>
                    }
                  }
                </div>

                <!-- Content -->
                <div class="ml-3 w-0 flex-1">
                  @if (toast.title) {
                    <p class="text-sm font-medium text-gray-900">
                      {{ toast.title }}
                    </p>
                  }
                  <p class="mt-1 text-sm text-gray-500">
                    {{ toast.message }}
                  </p>
                  @if (toast.action) {
                    <div class="mt-2">
                      <button
                        type="button"
                        class="text-sm font-medium text-primary-600 hover:text-primary-500"
                        (click)="onActionClick(toast)"
                      >
                        {{ toast.action.label }}
                      </button>
                    </div>
                  }
                </div>

                <!-- Close Button -->
                @if (toast.dismissible !== false) {
                  <div class="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      (click)="dismiss(toast)"
                    >
                      <span class="sr-only">Close</span>
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- Progress Bar -->
            @if (toast.duration && toast.duration > 0) {
              <div class="h-0.5 relative">
                <div
                  class="absolute bottom-0 left-0 h-full transition-all duration-300"
                  [class]="getProgressBarColor(toast)"
                  [style.width]="getProgressWidth(toast)"
                ></div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'scale(0.95)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  @Input() position: ToastPosition = 'top-right';
  @Input() maxToasts = 5;
  @Input() defaultDuration = 5000;

  @Output() dismissed = new EventEmitter<Toast>();

  toasts: Toast[] = [];
  private timers = new Map<string, any>();

  show(toast: Partial<Toast>): void {
    const newToast: Toast = {
      id: this.generateId(),
      message: toast.message || '',
      type: toast.type || 'info',
      title: toast.title,
      duration: toast.duration ?? this.defaultDuration,
      dismissible: toast.dismissible ?? true,
      action: toast.action
    };

    this.toasts.unshift(newToast);

    if (this.toasts.length > this.maxToasts) {
      const oldToast = this.toasts.pop();
      if (oldToast) {
        this.clearTimer(oldToast.id);
      }
    }

    if (newToast.duration && newToast.duration > 0) {
      this.setTimer(newToast);
    }
  }

  dismiss(toast: Toast): void {
    const index = this.toasts.indexOf(toast);
    if (index > -1) {
      this.toasts.splice(index, 1);
      this.clearTimer(toast.id);
      this.dismissed.emit(toast);
    }
  }

  onActionClick(toast: Toast): void {
    if (toast.action?.handler) {
      toast.action.handler();
    }
    this.dismiss(toast);
  }

  onAnimationDone(event: any, toast: Toast): void {
    if (event.toState === 'void') {
      this.clearTimer(toast.id);
    }
  }

  private setTimer(toast: Toast): void {
    this.clearTimer(toast.id);
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        this.dismiss(toast);
      }, toast.duration);
      this.timers.set(toast.id, timer);
    }
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2);
  }

  getContainerPosition(): string {
    const positions = {
      'top-right': 'top-0 right-0',
      'top-left': 'top-0 left-0',
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'top-center': 'top-0 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2'
    };
    return positions[this.position];
  }

  getProgressBarColor(toast: Toast): string {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };
    return colors[toast.type];
  }

  getProgressWidth(toast: Toast): string {
    const timer = this.timers.get(toast.id);
    if (!timer || !toast.duration) return '0%';
    const elapsed = Date.now() - timer.startTime;
    const progress = (1 - elapsed / toast.duration) * 100;
    return `${Math.max(0, Math.min(100, progress))}%`;
  }

  getAnimationState(toast: Toast): string {
    return toast.id;
  }

  // Helper method to show success toast
  success(message: string, options?: Partial<Toast>): void {
    this.show({ ...options, message, type: 'success' });
  }

  // Helper method to show error toast
  error(message: string, options?: Partial<Toast>): void {
    this.show({ ...options, message, type: 'error' });
  }

  // Helper method to show warning toast
  warning(message: string, options?: Partial<Toast>): void {
    this.show({ ...options, message, type: 'warning' });
  }

  // Helper method to show info toast
  info(message: string, options?: Partial<Toast>): void {
    this.show({ ...options, message, type: 'info' });
  }

  // Helper method to clear all toasts
  clear(): void {
    this.toasts.forEach(toast => this.clearTimer(toast.id));
    this.toasts = [];
  }

  // Helper method to get toast count
  getCount(): number {
    return this.toasts.length;
  }

  // Helper method to check if has active toasts
  hasToasts(): boolean {
    return this.toasts.length > 0;
  }

  // Helper method to pause timer on hover
  pauseTimer(toast: Toast): void {
    const timer = this.timers.get(toast.id);
    if (timer) {
      clearTimeout(timer);
      timer.remaining = timer.endTime - Date.now();
    }
  }

  // Helper method to resume timer after hover
  resumeTimer(toast: Toast): void {
    const timer = this.timers.get(toast.id);
    if (timer && timer.remaining) {
      timer.startTime = Date.now();
      timer.endTime = Date.now() + timer.remaining;
      const newTimer = setTimeout(() => {
        this.dismiss(toast);
      }, timer.remaining);
      this.timers.set(toast.id, newTimer);
    }
  }
}