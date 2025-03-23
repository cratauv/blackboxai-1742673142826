import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [ngClass]="[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled ? disabledClasses : '',
        loading ? loadingClasses : '',
        fullWidth ? 'w-full' : ''
      ]"
      (click)="onClick($event)"
    >
      <!-- Loading Spinner -->
      @if (loading) {
        <span class="inline-block mr-2">
          <svg 
            class="animate-spin h-4 w-4" 
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

      <!-- Icon (if provided) -->
      @if (icon && !loading) {
        <i [class]="icon" class="mr-2"></i>
      }

      <!-- Button Text -->
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
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
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() icon?: string;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  // Base classes applied to all buttons
  readonly baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `.trim();

  // Classes for different variants
  readonly variantClasses: Record<ButtonVariant, string> = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700
      focus:ring-primary-500
    `,
    secondary: `
      bg-gray-600 text-white
      hover:bg-gray-700
      focus:ring-gray-500
    `,
    outline: `
      border-2 border-primary-600 text-primary-600
      hover:bg-primary-50
      focus:ring-primary-500
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-red-500
    `,
    success: `
      bg-green-600 text-white
      hover:bg-green-700
      focus:ring-green-500
    `
  };

  // Classes for different sizes
  readonly sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Classes applied when button is disabled
  readonly disabledClasses = 'opacity-50 cursor-not-allowed';

  // Classes applied when button is loading
  readonly loadingClasses = 'cursor-wait';

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}