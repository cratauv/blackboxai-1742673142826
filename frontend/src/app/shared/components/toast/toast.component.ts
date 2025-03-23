import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed z-50 flex flex-col gap-2"
      [class]="getContainerClasses()"
      role="alert"
      aria-live="polite"
    >
      @for (toast of toasts; track toast.id) {
        <div
          class="transform transition-all duration-300 ease-in-out"
          [class]="getToastClasses(toast)"
          [class.translate-x-0]="!toast.isExiting"
          [class.translate-x-full]="toast.isExiting && position.includes('right')"
          [class.translate-x-[-100%]]="toast.isExiting && position.includes('left')"
          [class.translate-y-[-100%]]="toast.isExiting && position.includes('top')"
          [class.translate-y-full]="toast.isExiting && position.includes('bottom')"
        >
          <!-- Icon -->
          @if (toast.icon || getDefaultIcon(toast.type)) {
            <div class="flex-shrink-0">
              <i [class]="getIconClasses(toast)"></i>
            </div>
          }

          <!-- Content -->
          <div class="flex-1 ml-3">
            @if (toast.title) {
              <p class="text-sm font-medium text-gray-900">
                {{ toast.title }}
              </p>
            }
            <p
              [class.mt-1]="toast.title"
              class="text-sm text-gray-500"
            >
              {{ toast.message }}
            </p>
          </div>

          <!-- Close Button -->
          @if (toast.closeable) {
            <div class="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                (click)="removeToast(toast.id)"
              >
                <span class="sr-only">Close</span>
                <i class="fas fa-times"></i>
              </button>
            </div>
          }

          <!-- Progress Bar -->
          @if (toast.showProgress && toast.duration) {
            <div
              class="absolute bottom-0 left-0 h-1 bg-white bg-opacity-20 transition-all duration-300"
              [style.width.%]="getProgress(toast)"
            ></div>
          }
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  @Input() position: ToastPosition = 'top-right';
  @Input() maxToasts = 5;
  @Input() toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    icon?: string;
    duration?: number;
    closeable?: boolean;
    showProgress?: boolean;
    createdAt: Date;
    isExiting?: boolean;
  }> = [];

  @Output() toastRemoved = new EventEmitter<string>();

  getContainerClasses(): string {
    const positionClasses = {
      'top-right': 'top-0 right-0 p-4',
      'top-left': 'top-0 left-0 p-4',
      'bottom-right': 'bottom-0 right-0 p-4',
      'bottom-left': 'bottom-0 left-0 p-4',
      'top-center': 'top-0 left-1/2 -translate-x-1/2 p-4',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 p-4'
    };

    return positionClasses[this.position];
  }

  getToastClasses(toast: any): string {
    const baseClasses = 'relative flex items-start p-4 rounded-lg shadow-lg max-w-sm w-full';
    
    const typeClasses = {
      success: 'bg-success-50',
      error: 'bg-error-50',
      warning: 'bg-warning-50',
      info: 'bg-info-50'
    };

    return `${baseClasses} ${typeClasses[toast.type]}`;
  }

  getIconClasses(toast: any): string {
    const icon = toast.icon || this.getDefaultIcon(toast.type);
    const typeClasses = {
      success: 'text-success-400',
      error: 'text-error-400',
      warning: 'text-warning-400',
      info: 'text-info-400'
    };

    return `${icon} ${typeClasses[toast.type]}`;
  }

  getDefaultIcon(type: ToastType): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    return icons[type];
  }

  getProgress(toast: any): number {
    if (!toast.duration) return 0;
    
    const elapsed = Date.now() - toast.createdAt.getTime();
    const progress = 100 - (elapsed / toast.duration) * 100;
    
    return Math.max(0, Math.min(100, progress));
  }

  removeToast(id: string): void {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.isExiting = true;
      setTimeout(() => {
        this.toastRemoved.emit(id);
      }, 300);
    }
  }

  // Helper method to add toast
  addToast(toast: any): void {
    if (this.toasts.length >= this.maxToasts) {
      this.removeToast(this.toasts[0].id);
    }
    this.toasts.push({
      ...toast,
      id: toast.id || `toast-${Date.now()}`,
      createdAt: new Date(),
      closeable: toast.closeable ?? true,
      showProgress: toast.showProgress ?? true
    });
  }

  // Helper method to clear all toasts
  clearToasts(): void {
    this.toasts.forEach(toast => this.removeToast(toast.id));
  }

  // Helper method to update toast
  updateToast(id: string, updates: Partial<any>): void {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      Object.assign(toast, updates);
    }
  }

  // Helper method to get toast by id
  getToast(id: string): any {
    return this.toasts.find(t => t.id === id);
  }

  // Helper method to check if toast exists
  hasToast(id: string): boolean {
    return this.toasts.some(t => t.id === id);
  }

  // Helper method to get toast count
  getToastCount(): number {
    return this.toasts.length;
  }

  // Helper method to set position
  setPosition(position: ToastPosition): void {
    this.position = position;
  }

  // Helper method to set max toasts
  setMaxToasts(max: number): void {
    this.maxToasts = max;
    if (this.toasts.length > max) {
      this.toasts.slice(max).forEach(toast => this.removeToast(toast.id));
    }
  }

  // Helper method to pause toast timer
  pauseToast(id: string): void {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.isPaused = true;
    }
  }

  // Helper method to resume toast timer
  resumeToast(id: string): void {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.isPaused = false;
    }
  }
}