import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type AlertType = 'info' | 'success' | 'warning' | 'error';
type AlertSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isVisible"
      [@alertAnimation]
      role="alert"
      class="rounded-lg"
      [class]="getAlertClasses()"
    >
      <div class="flex">
        <!-- Icon -->
        @if (showIcon) {
          <div class="flex-shrink-0" [class]="getIconWrapperClasses()">
            <i [class]="getIconClasses()"></i>
          </div>
        }

        <!-- Content -->
        <div class="flex-1 md:flex md:justify-between">
          <div [class]="getContentClasses()">
            <!-- Title -->
            @if (title) {
              <h3 class="text-sm font-medium" [class]="getTitleClasses()">
                {{ title }}
              </h3>
            }

            <!-- Message -->
            <div 
              [class.mt-1]="title"
              [class]="getMessageClasses()"
            >
              <p class="text-sm">{{ message }}</p>
            </div>

            <!-- Additional Content -->
            @if (showContent) {
              <div class="mt-2">
                <ng-content></ng-content>
              </div>
            }
          </div>

          <!-- Action -->
          @if (actionLabel) {
            <div [class]="getActionClasses()">
              <button
                type="button"
                class="whitespace-nowrap rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
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
          <div class="ml-4 flex-shrink-0 self-start">
            <button
              type="button"
              class="rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              [class]="getCloseButtonClasses()"
              (click)="dismiss()"
            >
              <span class="sr-only">Dismiss</span>
              <i class="fas fa-times"></i>
            </button>
          </div>
        }
      </div>
    </div>
  `,
  animations: [
    trigger('alertAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() size: AlertSize = 'md';
  @Input() title = '';
  @Input() message = '';
  @Input() showIcon = true;
  @Input() dismissible = true;
  @Input() actionLabel = '';
  @Input() showContent = false;
  @Input() isVisible = true;

  @Output() dismissed = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();

  getAlertClasses(): string {
    const baseClasses = 'p-4';
    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg'
    };
    const typeClasses = {
      info: 'bg-blue-50 border border-blue-200',
      success: 'bg-green-50 border border-green-200',
      warning: 'bg-yellow-50 border border-yellow-200',
      error: 'bg-red-50 border border-red-200'
    };
    return `${baseClasses} ${sizeClasses[this.size]} ${typeClasses[this.type]}`;
  }

  getIconWrapperClasses(): string {
    return 'mr-3';
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

  getContentClasses(): string {
    return this.actionLabel ? 'ml-3 md:ml-0' : 'ml-3';
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

  getActionClasses(): string {
    return 'mt-3 md:mt-0 md:ml-6';
  }

  getActionButtonClasses(): string {
    const colors = {
      info: 'text-blue-600 hover:text-blue-500 focus:ring-blue-600',
      success: 'text-green-600 hover:text-green-500 focus:ring-green-600',
      warning: 'text-yellow-600 hover:text-yellow-500 focus:ring-yellow-600',
      error: 'text-red-600 hover:text-red-500 focus:ring-red-600'
    };
    return `${colors[this.type]} text-sm`;
  }

  getCloseButtonClasses(): string {
    const colors = {
      info: 'text-blue-400 hover:text-blue-500 focus:ring-blue-600',
      success: 'text-green-400 hover:text-green-500 focus:ring-green-600',
      warning: 'text-yellow-400 hover:text-yellow-500 focus:ring-yellow-600',
      error: 'text-red-400 hover:text-red-500 focus:ring-red-600'
    };
    return colors[this.type];
  }

  dismiss(): void {
    this.isVisible = false;
    this.dismissed.emit();
  }

  onAction(): void {
    this.action.emit();
  }

  // Helper method to show alert
  show(): void {
    this.isVisible = true;
  }

  // Helper method to hide alert
  hide(): void {
    this.isVisible = false;
  }

  // Helper method to toggle alert visibility
  toggle(): void {
    this.isVisible = !this.isVisible;
  }

  // Helper method to update alert type
  updateType(type: AlertType): void {
    this.type = type;
  }

  // Helper method to update alert message
  updateMessage(message: string): void {
    this.message = message;
  }

  // Helper method to get alert role
  getAlertRole(): string {
    const roles = {
      info: 'status',
      success: 'status',
      warning: 'alert',
      error: 'alert'
    };
    return roles[this.type];
  }

  // Helper method to get alert icon name
  getIconName(): string {
    const icons = {
      info: 'info-circle',
      success: 'check-circle',
      warning: 'exclamation-triangle',
      error: 'exclamation-circle'
    };
    return icons[this.type];
  }

  // Helper method to get alert background color
  getBgColor(): string {
    const colors = {
      info: 'bg-blue-50',
      success: 'bg-green-50',
      warning: 'bg-yellow-50',
      error: 'bg-red-50'
    };
    return colors[this.type];
  }

  // Helper method to get alert border color
  getBorderColor(): string {
    const colors = {
      info: 'border-blue-200',
      success: 'border-green-200',
      warning: 'border-yellow-200',
      error: 'border-red-200'
    };
    return colors[this.type];
  }
}