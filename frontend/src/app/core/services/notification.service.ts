import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { scan, map } from 'rxjs/operators';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
  data?: any;
  createdAt: Date;
}

export interface NotificationConfig {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  pauseOnHover?: boolean;
  showProgressBar?: boolean;
  closeButton?: boolean;
  preventDuplicates?: boolean;
  maxStack?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new Subject<Notification>();
  private defaultConfig: NotificationConfig = {
    duration: 5000,
    position: 'top-right',
    pauseOnHover: true,
    showProgressBar: true,
    closeButton: true,
    preventDuplicates: true,
    maxStack: 5
  };

  // Observable of current notifications
  notifications$ = this.notificationsSubject.pipe(
    scan((notifications: Notification[], notification: Notification) => {
      // Remove notifications that exceed maxStack
      if (this.defaultConfig.maxStack && notifications.length >= this.defaultConfig.maxStack) {
        notifications = notifications.slice(-this.defaultConfig.maxStack + 1);
      }
      return [...notifications, notification];
    }, [])
  );

  // Show success notification
  success(message: string, title?: string, config?: Partial<NotificationConfig>): string {
    return this.show('success', message, title, config);
  }

  // Show error notification
  error(message: string, title?: string, config?: Partial<NotificationConfig>): string {
    return this.show('error', message, title, config);
  }

  // Show warning notification
  warning(message: string, title?: string, config?: Partial<NotificationConfig>): string {
    return this.show('warning', message, title, config);
  }

  // Show info notification
  info(message: string, title?: string, config?: Partial<NotificationConfig>): string {
    return this.show('info', message, title, config);
  }

  // Show custom notification
  show(
    type: NotificationType,
    message: string,
    title?: string,
    config?: Partial<NotificationConfig>,
    data?: any
  ): string {
    const id = this.generateId();
    const notification: Notification = {
      id,
      type,
      message,
      title,
      data,
      createdAt: new Date(),
      ...this.defaultConfig,
      ...config
    };

    // Check for duplicates if preventDuplicates is enabled
    if (this.defaultConfig.preventDuplicates) {
      const isDuplicate = this.isDuplicateNotification(notification);
      if (isDuplicate) {
        return null;
      }
    }

    this.notificationsSubject.next(notification);
    return id;
  }

  // Remove notification by id
  remove(id: string): void {
    this.notificationsSubject.next(null);
  }

  // Clear all notifications
  clear(): void {
    this.notificationsSubject.next(null);
  }

  // Update notification config
  updateConfig(config: Partial<NotificationConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  // Get current config
  getConfig(): NotificationConfig {
    return { ...this.defaultConfig };
  }

  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private isDuplicateNotification(notification: Notification): boolean {
    let isDuplicate = false;
    this.notifications$.pipe(
      map(notifications => notifications.slice(-1)),
    ).subscribe(lastNotification => {
      if (lastNotification && lastNotification[0]?.message === notification.message) {
        isDuplicate = true;
      }
    });
    return isDuplicate;
  }

  // Helper method to create action notification
  showWithAction(
    type: NotificationType,
    message: string,
    actionLabel: string,
    actionCallback: () => void,
    config?: Partial<NotificationConfig>
  ): string {
    return this.show(type, message, undefined, {
      ...config,
      action: {
        label: actionLabel,
        callback: actionCallback
      }
    });
  }

  // Helper method to show loading notification
  showLoading(message: string, config?: Partial<NotificationConfig>): string {
    return this.show('info', message, undefined, {
      ...config,
      duration: 0,
      showProgressBar: false
    });
  }

  // Helper method to update notification
  update(id: string, updates: Partial<Notification>): void {
    this.notifications$.pipe(
      map(notifications => notifications.map(notification => 
        notification.id === id ? { ...notification, ...updates } : notification
      ))
    ).subscribe();
  }

  // Helper method to get notification by id
  getNotification(id: string): Observable<Notification> {
    return this.notifications$.pipe(
      map(notifications => notifications.find(n => n.id === id))
    );
  }

  // Helper method to check if notification exists
  exists(id: string): boolean {
    let exists = false;
    this.notifications$.pipe(
      map(notifications => notifications.some(n => n.id === id))
    ).subscribe(result => exists = result);
    return exists;
  }

  // Helper method to get notification count
  getCount(): Observable<number> {
    return this.notifications$.pipe(
      map(notifications => notifications.length)
    );
  }

  // Helper method to get notifications by type
  getByType(type: NotificationType): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => n.type === type))
    );
  }

  // Helper method to clear notifications by type
  clearByType(type: NotificationType): void {
    this.notifications$.pipe(
      map(notifications => notifications.filter(n => n.type !== type))
    ).subscribe();
  }

  // Helper method to clear notifications older than specified duration
  clearOlderThan(duration: number): void {
    const cutoff = new Date(Date.now() - duration);
    this.notifications$.pipe(
      map(notifications => notifications.filter(n => n.createdAt > cutoff))
    ).subscribe();
  }
}