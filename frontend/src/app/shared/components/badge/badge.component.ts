import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      [class]="getBadgeClasses()"
      [class.animate-pulse]="pulse"
      [class.cursor-pointer]="clickable"
      (click)="onClick()"
    >
      <!-- Icon (Left) -->
      @if (iconLeft) {
        <i [class]="iconLeft + ' mr-1'"></i>
      }

      <!-- Content -->
      <ng-content></ng-content>

      <!-- Icon (Right) -->
      @if (iconRight) {
        <i [class]="iconRight + ' ml-1'"></i>
      }

      <!-- Dot -->
      @if (dot) {
        <span
          class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 block h-2.5 w-2.5 rounded-full ring-2 ring-white"
          [class]="getDotClasses()"
        ></span>
      }
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() rounded = true;
  @Input() outlined = false;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() dot = false;
  @Input() pulse = false;
  @Input() clickable = false;

  private readonly variantClasses: Record<BadgeVariant, string> = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-success-100 text-success-800',
    danger: 'bg-error-100 text-error-800',
    warning: 'bg-warning-100 text-warning-800',
    info: 'bg-info-100 text-info-800'
  };

  private readonly outlinedClasses: Record<BadgeVariant, string> = {
    primary: 'border-primary-500 text-primary-700',
    secondary: 'border-gray-500 text-gray-700',
    success: 'border-success-500 text-success-700',
    danger: 'border-error-500 text-error-700',
    warning: 'border-warning-500 text-warning-700',
    info: 'border-info-500 text-info-700'
  };

  private readonly dotClasses: Record<BadgeVariant, string> = {
    primary: 'bg-primary-400',
    secondary: 'bg-gray-400',
    success: 'bg-success-400',
    danger: 'bg-error-400',
    warning: 'bg-warning-400',
    info: 'bg-info-400'
  };

  private readonly sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  getBadgeClasses(): string {
    const classes = [
      'inline-flex items-center font-medium relative',
      this.sizeClasses[this.size],
      this.rounded ? 'rounded-full' : 'rounded',
      this.outlined
        ? `bg-white border ${this.outlinedClasses[this.variant]}`
        : this.variantClasses[this.variant],
      this.clickable ? 'hover:opacity-80 transition-opacity' : ''
    ];

    return classes.filter(Boolean).join(' ');
  }

  getDotClasses(): string {
    return this.dotClasses[this.variant];
  }

  onClick(): void {
    // Emit click event if needed
  }

  // Helper method to set variant
  setVariant(variant: BadgeVariant): void {
    this.variant = variant;
  }

  // Helper method to set size
  setSize(size: BadgeSize): void {
    this.size = size;
  }

  // Helper method to toggle outline
  toggleOutline(): void {
    this.outlined = !this.outlined;
  }

  // Helper method to toggle rounded
  toggleRounded(): void {
    this.rounded = !this.rounded;
  }

  // Helper method to toggle dot
  toggleDot(): void {
    this.dot = !this.dot;
  }

  // Helper method to toggle pulse
  togglePulse(): void {
    this.pulse = !this.pulse;
  }

  // Helper method to toggle clickable
  toggleClickable(): void {
    this.clickable = !this.clickable;
  }

  // Helper method to set left icon
  setLeftIcon(icon: string): void {
    this.iconLeft = icon;
  }

  // Helper method to set right icon
  setRightIcon(icon: string): void {
    this.iconRight = icon;
  }

  // Helper method to clear icons
  clearIcons(): void {
    this.iconLeft = undefined;
    this.iconRight = undefined;
  }
}