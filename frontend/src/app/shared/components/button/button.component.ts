import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClasses()"
      (click)="onClick($event)"
    >
      <!-- Loading Spinner -->
      @if (loading) {
        <span class="absolute inset-0 flex items-center justify-center">
          <svg
            class="animate-spin h-5 w-5"
            [class]="getSpinnerColorClass()"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      }

      <!-- Icon (Left) -->
      @if (iconLeft && !loading) {
        <i [class]="iconLeft + ' mr-2'"></i>
      }

      <!-- Content -->
      <span [class.opacity-0]="loading">
        <ng-content></ng-content>
      </span>

      <!-- Icon (Right) -->
      @if (iconRight && !loading) {
        <i [class]="iconRight + ' ml-2'"></i>
      }

      <!-- Badge -->
      @if (badge) {
        <span
          class="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold rounded-full"
          [class]="getBadgeClasses()"
        >
          {{ badge }}
        </span>
      }
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      line-height: 1.25;
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: ButtonType = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() block = false;
  @Input() rounded = false;
  @Input() outlined = false;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() badge?: string | number;
  @Input() ripple = true;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  private readonly variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
    info: 'bg-info-600 text-white hover:bg-info-700 focus:ring-info-500',
    light: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-200',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700',
    link: 'bg-transparent text-primary-600 hover:text-primary-700 hover:underline'
  };

  private readonly outlinedClasses: Record<ButtonVariant, string> = {
    primary: 'border-primary-600 text-primary-600 hover:bg-primary-50',
    secondary: 'border-gray-600 text-gray-600 hover:bg-gray-50',
    success: 'border-success-600 text-success-600 hover:bg-success-50',
    danger: 'border-error-600 text-error-600 hover:bg-error-50',
    warning: 'border-warning-600 text-warning-600 hover:bg-warning-50',
    info: 'border-info-600 text-info-600 hover:bg-info-50',
    light: 'border-gray-200 text-gray-700 hover:bg-gray-50',
    dark: 'border-gray-800 text-gray-800 hover:bg-gray-100',
    link: 'border-transparent text-primary-600 hover:text-primary-700'
  };

  private readonly sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  private readonly badgeClasses: Record<ButtonVariant, string> = {
    primary: 'bg-white text-primary-600',
    secondary: 'bg-white text-gray-600',
    success: 'bg-white text-success-600',
    danger: 'bg-white text-error-600',
    warning: 'bg-white text-warning-600',
    info: 'bg-white text-info-600',
    light: 'bg-gray-800 text-white',
    dark: 'bg-white text-gray-800',
    link: 'bg-primary-600 text-white'
  };

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }

  getButtonClasses(): string {
    const classes = [
      // Base classes
      'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
      
      // Size classes
      this.sizeClasses[this.size],
      
      // Block class
      this.block ? 'w-full' : '',
      
      // Rounded class
      this.rounded ? 'rounded-full' : '',
      
      // Variant classes
      this.outlined
        ? `bg-transparent border-2 ${this.outlinedClasses[this.variant]}`
        : this.variantClasses[this.variant],
      
      // Disabled class
      this.disabled ? 'cursor-not-allowed opacity-65' : '',
      
      // Loading class
      this.loading ? 'relative' : ''
    ];

    return classes.filter(Boolean).join(' ');
  }

  getBadgeClasses(): string {
    return this.badgeClasses[this.variant];
  }

  getSpinnerColorClass(): string {
    return this.outlined ? `text-${this.variant}-600` : 'text-white';
  }

  // Helper method to set loading state
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  // Helper method to set disabled state
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  // Helper method to set variant
  setVariant(variant: ButtonVariant): void {
    this.variant = variant;
  }

  // Helper method to set size
  setSize(size: ButtonSize): void {
    this.size = size;
  }

  // Helper method to set badge
  setBadge(badge: string | number): void {
    this.badge = badge;
  }

  // Helper method to toggle outline
  toggleOutline(): void {
    this.outlined = !this.outlined;
  }

  // Helper method to toggle block
  toggleBlock(): void {
    this.block = !this.block;
  }

  // Helper method to toggle rounded
  toggleRounded(): void {
    this.rounded = !this.rounded;
  }
}