import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification, NotificationType } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed z-50 flex flex-col gap-2 p-4 max-w-md w-full"
      [class]="getPositionClasses()"
    >
      @for (notification of notifications; track notification.id) {
        <div
          class="flex items-start p-4 rounded-lg shadow-lg transform transition-all duration-300"
          [class]="getNotificationClasses(notification)"
          role="alert"
          [@fadeInOut]
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <i [class]="getIconClasses(notification.type)"></i>
          </div>

          <!-- Content -->
          <div class="ml-3 w-0 flex-1">
            @if (notification.title) {
              <p class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
            }
            <p
              [class.mt-1]="notification.title"
              class="text-sm text-gray-500"
            >
              {{ notification.message }}
            </p>

            <!-- Action Button -->
            @if (notification.action) {
              <div class="mt-3 flex gap-2">
                <button
                  type="button"
                  class="text-sm font-medium text-primary-600 hover:text-primary-500"
                  (click)="onActionClick(notification)"
                >
                  {{ notification.action.label }}
                </button>
              </div>
            }
          </div>

          <!-- Close Button -->
          @if (notification.closeButton !== false) {
            <div class="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                (click)="removeNotification(notification.id)"
              >
                <span class="sr-only">Close</span>
                <i class="fas fa-times"></i>
              </button>
            </div>
          }

          <!-- Progress Bar -->
          @if (notification.showProgressBar !== false && notification.duration) {
            <div
              class="absolute bottom-0 left-0 h-1 bg-white bg-opacity-20"
              [style.width.%]="getProgress(notification)"
            ></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      pointer-events: none;
    }

    .notification {
      pointer-events: auto;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-100%);
      }
    }

    .fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    .fade-out {
      animation: fadeOut 0.3s ease-out;
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription;
  private readonly DEFAULT_DURATION = 5000;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
        this.setupAutoDismiss();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  onActionClick(notification: Notification): void {
    if (notification.action?.callback) {
      notification.action.callback();
    }
    this.removeNotification(notification.id);
  }

  getNotificationClasses(notification: Notification): string {
    const baseClasses = 'notification relative overflow-hidden';
    const typeClasses = {
      success: 'bg-success-50 text-success-800',
      error: 'bg-error-50 text-error-800',
      warning: 'bg-warning-50 text-warning-800',
      info: 'bg-info-50 text-info-800'
    };
    return `${baseClasses} ${typeClasses[notification.type]}`;
  }

  getIconClasses(type: NotificationType): string {
    const baseClasses = 'fas fa-lg';
    const typeClasses = {
      success: 'fa-check-circle text-success-500',
      error: 'fa-exclamation-circle text-error-500',
      warning: 'fa-exclamation-triangle text-warning-500',
      info: 'fa-info-circle text-info-500'
    };
    return `${baseClasses} ${typeClasses[type]}`;
  }

  getPositionClasses(): string {
    const position = this.notificationService.getConfig().position;
    const classes = {
      'top-right': 'top-0 right-0',
      'top-left': 'top-0 left-0',
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'top-center': 'top-0 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2'
    };
    return classes[position] || classes['top-right'];
  }

  getProgress(notification: Notification): number {
    const createdAt = notification.createdAt.getTime();
    const duration = notification.duration || this.DEFAULT_DURATION;
    const now = Date.now();
    const elapsed = now - createdAt;
    const progress = 100 - (elapsed / duration) * 100;
    return Math.max(0, Math.min(100, progress));
  }

  private setupAutoDismiss(): void {
    this.notifications.forEach(notification => {
      if (notification.duration !== 0) {
        const duration = notification.duration || this.DEFAULT_DURATION;
        setTimeout(() => {
          this.removeNotification(notification.id);
        }, duration);
      }
    });
  }

  // Helper method to pause notification timer on hover
  pauseTimer(notification: Notification): void {
    // Implement pause logic
  }

  // Helper method to resume notification timer
  resumeTimer(notification: Notification): void {
    // Implement resume logic
  }

  // Helper method to clear all notifications
  clearAll(): void {
    this.notifications = [];
  }

  // Helper method to get notification by id
  getNotification(id: string): Notification | undefined {
    return this.notifications.find(n => n.id === id);
  }

  // Helper method to update notification
  updateNotification(id: string, updates: Partial<Notification>): void {
    this.notifications = this.notifications.map(notification =>
      notification.id === id ? { ...notification, ...updates } : notification
    );
  }

  // Helper method to get notification count
  getCount(): number {
    return this.notifications.length;
  }

  // Helper method to get notifications by type
  getByType(type: NotificationType): Notification[] {
    return this.notifications.filter(n => n.type === type);
  }

  // Helper method to check if notification exists
  exists(id: string): boolean {
    return this.notifications.some(n => n.id === id);
  }
}