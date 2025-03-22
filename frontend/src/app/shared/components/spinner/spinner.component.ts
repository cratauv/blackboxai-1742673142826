import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type SpinnerType = 'border' | 'grow' | 'dots' | 'pulse';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      role="status"
      [class]="getContainerClasses()"
    >
      @switch (type) {
        @case ('border') {
          <!-- Border Spinner -->
          <div
            class="animate-spin rounded-full border-transparent"
            [class]="getBorderSpinnerClasses()"
          ></div>
        }
        @case ('grow') {
          <!-- Growing Spinner -->
          <div
            class="animate-pulse rounded-full"
            [class]="getGrowSpinnerClasses()"
          ></div>
        }
        @case ('dots') {
          <!-- Dots Spinner -->
          <div class="flex space-x-1">
            @for (dot of [1, 2, 3]; track dot) {
              <div
                class="animate-bounce rounded-full"
                [class]="getDotsSpinnerClasses()"
                [style.animation-delay]="(dot - 1) * 0.15 + 's'"
              ></div>
            }
          </div>
        }
        @case ('pulse') {
          <!-- Pulse Spinner -->
          <div class="relative">
            <div
              class="absolute animate-ping rounded-full opacity-75"
              [class]="getPulseSpinnerClasses()"
            ></div>
            <div
              class="relative rounded-full"
              [class]="getPulseSpinnerClasses()"
            ></div>
          </div>
        }
      }

      <!-- Label -->
      @if (label) {
        <span 
          class="ml-2"
          [class]="getLabelClasses()"
        >
          {{ label }}
        </span>
      }

      <!-- Screen Reader Text -->
      <span class="sr-only">Loading...</span>
    </div>
  `,
  styles: [`
    @keyframes bounce-delay {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `]
})
export class SpinnerComponent {
  @Input() type: SpinnerType = 'border';
  @Input() variant: SpinnerVariant = 'primary';
  @Input() size: SpinnerSize = 'md';
  @Input() label = '';
  @Input() centered = false;

  getContainerClasses(): string {
    const baseClasses = 'inline-flex items-center';
    const centeredClasses = this.centered ? 'justify-center' : '';
    return `${baseClasses} ${centeredClasses}`;
  }

  getBorderSpinnerClasses(): string {
    const sizeClasses = {
      xs: 'h-3 w-3 border-2',
      sm: 'h-4 w-4 border-2',
      md: 'h-6 w-6 border-3',
      lg: 'h-8 w-8 border-4',
      xl: 'h-10 w-10 border-4'
    };

    const variantClasses = {
      primary: 'border-primary-600',
      secondary: 'border-gray-600',
      success: 'border-green-600',
      warning: 'border-yellow-600',
      danger: 'border-red-600'
    };

    return `${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  getGrowSpinnerClasses(): string {
    const sizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10'
    };

    const variantClasses = {
      primary: 'bg-primary-600',
      secondary: 'bg-gray-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600'
    };

    return `${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  getDotsSpinnerClasses(): string {
    const sizeClasses = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4'
    };

    const variantClasses = {
      primary: 'bg-primary-600',
      secondary: 'bg-gray-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600'
    };

    return `${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  getPulseSpinnerClasses(): string {
    const sizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10'
    };

    const variantClasses = {
      primary: 'bg-primary-600',
      secondary: 'bg-gray-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600'
    };

    return `${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  getLabelClasses(): string {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };

    const variantClasses = {
      primary: 'text-primary-600',
      secondary: 'text-gray-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      danger: 'text-red-600'
    };

    return `${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  // Helper method to get animation duration
  getAnimationDuration(): string {
    const durations = {
      border: '0.75s',
      grow: '0.75s',
      dots: '0.6s',
      pulse: '1s'
    };
    return durations[this.type];
  }

  // Helper method to get animation timing function
  getAnimationTiming(): string {
    const timings = {
      border: 'linear',
      grow: 'ease-in-out',
      dots: 'ease-in-out',
      pulse: 'cubic-bezier(0, 0, 0.2, 1)'
    };
    return timings[this.type];
  }

  // Helper method to get spinner dimensions
  getDimensions(): { width: string; height: string } {
    const dimensions = {
      xs: { width: '0.75rem', height: '0.75rem' },
      sm: { width: '1rem', height: '1rem' },
      md: { width: '1.5rem', height: '1.5rem' },
      lg: { width: '2rem', height: '2rem' },
      xl: { width: '2.5rem', height: '2.5rem' }
    };
    return dimensions[this.size];
  }

  // Helper method to get border width
  getBorderWidth(): string {
    const widths = {
      xs: '2px',
      sm: '2px',
      md: '3px',
      lg: '4px',
      xl: '4px'
    };
    return widths[this.size];
  }

  // Helper method to get color
  getColor(): string {
    const colors = {
      primary: '#2563EB',
      secondary: '#4B5563',
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626'
    };
    return colors[this.variant];
  }
}