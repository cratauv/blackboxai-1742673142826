import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';
type AvatarShape = 'circle' | 'square';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <!-- Avatar Container -->
      <div
        [class]="getContainerClasses()"
        [style.backgroundColor]="!src && bgColor"
      >
        @if (src) {
          <!-- Image -->
          <img
            [src]="src"
            [alt]="alt"
            class="h-full w-full object-cover"
            [class.rounded-full]="shape === 'circle'"
            [class.rounded-lg]="shape === 'square'"
            (error)="onImageError()"
          />
        } @else {
          <!-- Initials -->
          <span 
            class="flex h-full w-full items-center justify-center font-medium text-white"
            [class.text-xs]="size === 'xs'"
            [class.text-sm]="size === 'sm'"
            [class.text-base]="size === 'md'"
            [class.text-lg]="size === 'lg'"
            [class.text-xl]="size === 'xl'"
          >
            {{ getInitials() }}
          </span>
        }

        <!-- Status Indicator -->
        @if (showStatus) {
          <span
            class="absolute bottom-0 right-0 block rounded-full ring-2 ring-white"
            [class]="getStatusClasses()"
          ></span>
        }

        <!-- Badge -->
        @if (badge) {
          <div 
            class="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white ring-2 ring-white"
            [class]="getBadgeClasses()"
          >
            {{ badge }}
          </div>
        }

        <!-- Group Indicator -->
        @if (isGroup) {
          <div class="absolute bottom-0 right-0 rounded-full bg-gray-100 p-1 ring-2 ring-white">
            <i class="fas fa-users text-xs text-gray-600"></i>
          </div>
        }
      </div>
    </div>
  `
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() alt = '';
  @Input() size: AvatarSize = 'md';
  @Input() shape: AvatarShape = 'circle';
  @Input() status?: AvatarStatus;
  @Input() badge?: string | number;
  @Input() isGroup = false;
  @Input() name = '';
  @Input() bgColor?: string;
  @Input() showStatus = false;

  private fallbackColors = [
    '#F87171', // red-400
    '#FB923C', // orange-400
    '#FBBF24', // amber-400
    '#34D399', // emerald-400
    '#60A5FA', // blue-400
    '#A78BFA', // violet-400
    '#F472B6'  // pink-400
  ];

  getContainerClasses(): string {
    const sizeClasses = {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-14 w-14'
    };

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-lg'
    };

    return `relative flex overflow-hidden ${sizeClasses[this.size]} ${shapeClasses[this.shape]}`;
  }

  getStatusClasses(): string {
    const baseClasses = 'h-2.5 w-2.5';
    const statusColors = {
      online: 'bg-green-400',
      offline: 'bg-gray-400',
      busy: 'bg-red-400',
      away: 'bg-yellow-400'
    };

    return `${baseClasses} ${this.status ? statusColors[this.status] : ''}`;
  }

  getBadgeClasses(): string {
    const sizeClasses = {
      xs: 'h-3 w-3 text-[8px]',
      sm: 'h-4 w-4 text-[10px]',
      md: 'h-5 w-5 text-xs',
      lg: 'h-6 w-6 text-sm',
      xl: 'h-7 w-7 text-base'
    };

    return sizeClasses[this.size];
  }

  getInitials(): string {
    if (!this.name) return '?';

    return this.name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  onImageError(): void {
    this.src = undefined;
    if (!this.bgColor) {
      this.bgColor = this.getRandomColor();
    }
  }

  private getRandomColor(): string {
    const hash = this.name
      .split('')
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return this.fallbackColors[hash % this.fallbackColors.length];
  }

  // Helper method to get status dot position
  getStatusPosition(): { bottom: string; right: string } {
    const positions = {
      xs: { bottom: '-1px', right: '-1px' },
      sm: { bottom: '-1px', right: '-1px' },
      md: { bottom: '0', right: '0' },
      lg: { bottom: '2px', right: '2px' },
      xl: { bottom: '2px', right: '2px' }
    };
    return positions[this.size];
  }

  // Helper method to get badge position
  getBadgePosition(): { top: string; right: string } {
    const positions = {
      xs: { top: '-4px', right: '-4px' },
      sm: { top: '-4px', right: '-4px' },
      md: { top: '-6px', right: '-6px' },
      lg: { top: '-8px', right: '-8px' },
      xl: { top: '-8px', right: '-8px' }
    };
    return positions[this.size];
  }

  // Helper method to get font size for initials
  getInitialsFontSize(): string {
    const sizes = {
      xs: '10px',
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '20px'
    };
    return sizes[this.size];
  }

  // Helper method to check if avatar should show initials
  shouldShowInitials(): boolean {
    return !this.src && !!this.name;
  }

  // Helper method to get contrast text color
  getContrastTextColor(bgColor: string): 'text-white' | 'text-gray-900' {
    // Simple contrast calculation
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'text-gray-900' : 'text-white';
  }
}