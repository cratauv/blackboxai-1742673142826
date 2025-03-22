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
      class="inline-flex items-center justify-center"
      [class]="[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded ? 'full' : 'default'],
        pulseClasses[pulse ? 'active' : 'inactive']
      ]"
    >
      @if (icon) {
        <i [class]="icon" [class.mr-1]="!!content"></i>
      }
      
      @if (content) {
        <span>{{ content }}</span>
      }

      @if (!icon && !content && showDot) {
        <span class="flex h-2 w-2 rounded-full" [class]="dotClasses[variant]"></span>
      }
    </span>
  `,
  styles: [`
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.8;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `]
})
export class BadgeComponent {
  @Input() content?: string | number;
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() icon?: string;
  @Input() rounded = false;
  @Input() pulse = false;
  @Input() showDot = false;

  // Base classes applied to all badges
  readonly baseClasses = `
    font-medium whitespace-nowrap
  `.trim();

  // Classes for different variants
  readonly variantClasses: Record<BadgeVariant, string> = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  };

  // Classes for different sizes
  readonly sizeClasses: Record<BadgeSize, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  // Classes for rounded variants
  readonly roundedClasses: Record<'default' | 'full', string> = {
    default: 'rounded',
    full: 'rounded-full'
  };

  // Classes for pulse animation
  readonly pulseClasses: Record<'active' | 'inactive', string> = {
    active: 'animate-pulse',
    inactive: ''
  };

  // Classes for dot variants
  readonly dotClasses: Record<BadgeVariant, string> = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  };

  // Helper method to get contrast text color
  getContrastText(bgColor: string): string {
    // Simple contrast calculation
    const colors = {
      'primary': 'text-primary-800',
      'secondary': 'text-gray-800',
      'success': 'text-green-800',
      'danger': 'text-red-800',
      'warning': 'text-yellow-800',
      'info': 'text-blue-800'
    };
    return colors[bgColor as keyof typeof colors] || 'text-gray-800';
  }

  // Helper method to format number content
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }

  // Helper method to get content display
  getDisplayContent(): string {
    if (typeof this.content === 'number') {
      return this.formatNumber(this.content);
    }
    return this.content || '';
  }

  // Helper method to check if content is numeric
  isNumeric(): boolean {
    return typeof this.content === 'number';
  }

  // Helper method to get animation classes
  getAnimationClasses(): string {
    const classes = [];
    if (this.pulse) {
      classes.push('animate-pulse');
    }
    return classes.join(' ');
  }
}