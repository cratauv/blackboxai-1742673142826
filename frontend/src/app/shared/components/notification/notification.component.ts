import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-4 min-w-[320px] max-w-[400px]">
      @for (notification of notifications; track notification.id) {
        <div
          class="notification-item flex items-center p-4 rounded-lg shadow-lg"
          [ngClass]="getNotificationStyles(notification.type).bgColor"
          [@slideIn]="'visible'"
        >
          <!-- Icon -->
          <i 
            class="text-xl mr-3"
            [ngClass]="[getNotificationStyles(notification.type).icon, getNotificationStyles(notification.type).textColor]"
          ></i>

          <!-- Content -->
          <div class="flex-grow">
            <p [ngClass]="getNotificationStyles(notification.type).textColor">
              {{ notification.message }}
            </p>
          </div>

          <!-- Action Button (if provided) -->
          @if (notification.action) {
            <button
              class="ml-4 px-3 py-1 rounded-md text-sm font-medium"
              [ngClass]="getNotificationStyles(notification.type).textColor"
              (click)="handleAction(notification)"
            >
              {{ notification.action.text }}
            </button>
          }

          <!-- Close Button -->
          <button
            class="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
            (click)="dismiss(notification.id)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-item {
      max-width: 100%;
      word-break: break-word;
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ 
          transform: 'translateX(100%)',
          opacity: 0 
        }),
        animate('300ms ease-out', style({ 
          transform: 'translateX(0)',
          opacity: 1 
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ 
          transform: 'translateX(100%)',
          opacity: 0 
        }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  handleAction(notification: Notification): void {
    if (notification.action?.callback) {
      notification.action.callback();
    }
    this.dismiss(notification.id);
  }

  getNotificationStyles(type: string): { icon: string; bgColor: string; textColor: string } {
    return this.notificationService.getNotificationStyles(type);
  }
}