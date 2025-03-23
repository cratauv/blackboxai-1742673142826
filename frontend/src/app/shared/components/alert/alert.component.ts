import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type AlertType = 'info' | 'success' | 'warning' | 'error';
type AlertSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="rounded-lg"
      [class]="getAlertClasses()"
      role="alert"
      [attr.aria-live]="type === 'error' ? 'assertive' : 'polite'"
    >
      <div class="flex">
        <!-- Icon -->
        @if (showIcon) {
          <div class="flex-shrink-0">
            @switch (type) {
              @case ('info') {
                <i class="fas fa-info-circle text-blue-400"></i>
              }
              @case ('success') {
                <i class="fas fa-check-circle text-green-400"></i>
              }
              @case ('warning') {
                <i class="fas fa-exclamation-circle text-yellow-400"></i>
              }
              @case ('error') {
                <i class="fas fa-times-circle text-red-400"></i>
              }
            }
          </div>
        }

        <!-- Content -->
        <div class="flex-1 ml-3">
          <!-- Title -->
          @if (title) {
            <h3 [class]="getTitleClasses()">
              {{ title }}
            </h3>
          }

          <!-- Message -->
          <div [class]="getMessageClasses()">
            <ng-content></ng-content>
          </div>

          <!-- Actions -->
          @if (showActions) {
            <div class="mt-3">
              <div class="-mx-2 -my-1.5 flex">
                @if (primaryAction) {
                  <button
                    type="button"
                    [class]="getPrimaryActionClasses()"
                    (click)="onPrimaryAction()"
                  >
                    {{ primaryAction }}
                  </button>
                }
                @if (secondaryAction) {
                  <button
                    type="button"
                    [class]="getSecondaryActionClasses()"
                    (click)="onSecondaryAction()"
                  >
                    {{ secondaryAction }}
                  </button>
                }
              </div>
            </div>
          }
        </div>

        <!-- Close Button -->
        @if (dismissible) {
          <div class="ml-auto pl-3">
            <button
              type="button"
              [class]="getCloseButtonClasses()"
              (click)="dismiss()"
              aria-label="Dismiss"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() size: AlertSize = 'md';
  @Input() title = '';
  @Input() showIcon = true;
  @Input() dismissible = true;
  @Input() showActions = false;
  @Input() primaryAction = '';
  @Input() secondaryAction = '';
  @Input() outlined = false;

  @Output() dismissed = new EventEmitter<void>();
  @Output() primaryActionClick = new EventEmitter<void>();
  @Output() secondaryActionClick = new EventEmitter<void>();

  private readonly typeMap = {
    solid: {
      info: 'bg-blue-50 text-blue-700',
      success: 'bg-green-50 text-green-700',
      warning: 'bg-yellow-50 text-yellow-700',
      error: 'bg-red-50 text-red-700'
    },
    outline: {
      info: 'border border-blue-300 text-blue-700',
      success: 'border border-green-300 text-green-700',
      warning: 'border border-yellow-300 text-yellow-700',
      error: 'border border-red-300 text-red-700'
    }
  };

  private readonly sizeMap = {
    sm: {
      padding: 'p-3',
      icon: 'text-sm',
      title: 'text-sm font-medium',
      message: 'text-sm',
      button: 'px-2 py-1.5 text-sm'
    },
    md: {
      padding: 'p-4',
      icon: 'text-base',
      title: 'text-base font-medium',
      message: 'text-base',
      button: 'px-3 py-2 text-sm'
    },
    lg: {
      padding: 'p-5',
      icon: 'text-lg',
      title: 'text-lg font-medium',
      message: 'text-base',
      button: 'px-4 py-2.5 text-base'
    }
  };

  getAlertClasses(): string {
    const variant = this.outlined ? 'outline' : 'solid';
    return `
      ${this.typeMap[variant][this.type]}
      ${this.sizeMap[this.size].padding}
    `;
  }

  getTitleClasses(): string {
    return this.sizeMap[this.size].title;
  }

  getMessageClasses(): string {
    return `
      ${this.sizeMap[this.size].message}
      ${this.title ? 'mt-1' : ''}
    `;
  }

  getCloseButtonClasses(): string {
    return `
      ${this.sizeMap[this.size].icon}
      hover:bg-opacity-20
      rounded-lg
      p-1.5
      inline-flex
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      focus:ring-${this.type === 'info' ? 'blue' : this.type}-500
    `;
  }

  getPrimaryActionClasses(): string {
    return `
      ${this.sizeMap[this.size].button}
      bg-${this.type === 'info' ? 'blue' : this.type}-100
      text-${this.type === 'info' ? 'blue' : this.type}-700
      hover:bg-${this.type === 'info' ? 'blue' : this.type}-200
      rounded-md
      font-medium
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      focus:ring-${this.type === 'info' ? 'blue' : this.type}-500
      mr-2
    `;
  }

  getSecondaryActionClasses(): string {
    return `
      ${this.sizeMap[this.size].button}
      text-${this.type === 'info' ? 'blue' : this.type}-700
      hover:bg-${this.type === 'info' ? 'blue' : this.type}-100
      rounded-md
      font-medium
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      focus:ring-${this.type === 'info' ? 'blue' : this.type}-500
    `;
  }

  dismiss(): void {
    this.dismissed.emit();
  }

  onPrimaryAction(): void {
    this.primaryActionClick.emit();
  }

  onSecondaryAction(): void {
    this.secondaryActionClick.emit();
  }

  // Helper method to set type
  setType(type: AlertType): void {
    this.type = type;
  }

  // Helper method to set size
  setSize(size: AlertSize): void {
    this.size = size;
  }

  // Helper method to set title
  setTitle(title: string): void {
    this.title = title;
  }

  // Helper method to toggle icon
  toggleIcon(show: boolean): void {
    this.showIcon = show;
  }

  // Helper method to toggle dismissible
  toggleDismissible(dismissible: boolean): void {
    this.dismissible = dismissible;
  }

  // Helper method to set actions
  setActions(primary: string, secondary: string = ''): void {
    this.primaryAction = primary;
    this.secondaryAction = secondary;
    this.showActions = !!(primary || secondary);
  }

  // Helper method to toggle outline style
  toggleOutline(outlined: boolean): void {
    this.outlined = outlined;
  }

  // Helper method to get color scheme
  getColorScheme(): { background: string; text: string; border?: string } {
    const variant = this.outlined ? 'outline' : 'solid';
    const classes = this.typeMap[variant][this.type].split(' ');
    return {
      background: classes.find(c => c.startsWith('bg-')) || '',
      text: classes.find(c => c.startsWith('text-')) || '',
      border: classes.find(c => c.startsWith('border-'))
    };
  }

  // Helper method to get dimensions
  getDimensions(): { padding: string; fontSize: string } {
    return {
      padding: this.sizeMap[this.size].padding,
      fontSize: this.sizeMap[this.size].message
    };
  }

  // Helper method to check if has title
  hasTitle(): boolean {
    return !!this.title;
  }

  // Helper method to check if has actions
  hasActions(): boolean {
    return this.showActions && !!(this.primaryAction || this.secondaryAction);
  }
}