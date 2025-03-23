import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  action?: {
    text: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  private defaultDuration = 5000; // 5 seconds

  show(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || this.defaultDuration
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, newNotification]);

    // Auto dismiss after duration
    if (newNotification.duration !== 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newNotification.duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show({
      type: 'success',
      message,
      duration
    });
  }

  error(message: string, duration?: number): void {
    this.show({
      type: 'error',
      message,
      duration
    });
  }

  info(message: string, duration?: number): void {
    this.show({
      type: 'info',
      message,
      duration
    });
  }

  warning(message: string, duration?: number): void {
    this.show({
      type: 'warning',
      message,
      duration
    });
  }

  dismiss(id: string): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  clear(): void {
    this.notifications.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Helper methods for getting notification styles
  getNotificationStyles(type: string): { icon: string; bgColor: string; textColor: string } {
    const styles: { [key: string]: { icon: string; bgColor: string; textColor: string } } = {
      success: {
        icon: 'fas fa-check-circle',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      },
      error: {
        icon: 'fas fa-exclamation-circle',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      },
      warning: {
        icon: 'fas fa-exclamation-triangle',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      },
      info: {
        icon: 'fas fa-info-circle',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800'
      }
    };

    return styles[type] || styles.info;
  }

  // Method to show confirmation dialog
  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const notification: Omit<Notification, 'id'> = {
        type: 'warning',
        message,
        duration: 0,
        action: {
          text: 'Confirm',
          callback: () => {
            resolve(true);
            this.dismiss('confirm');
          }
        }
      };

      this.show({
        ...notification,
        id: 'confirm'
      });

      // Add cancel button
      setTimeout(() => {
        const currentNotifications = this.notifications.value;
        const confirmNotification = currentNotifications.find(n => n.id === 'confirm');
        if (confirmNotification) {
          this.dismiss('confirm');
          resolve(false);
        }
      }, 10000); // Auto cancel after 10 seconds
    });
  }
}