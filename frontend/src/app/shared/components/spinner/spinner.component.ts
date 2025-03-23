import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerType = 'border' | 'grow' | 'dots' | 'pulse' | 'wave';
type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="inline-flex items-center justify-center"
      [class.opacity-50]="dimmed"
      role="status"
    >
      @switch (type) {
        @case ('border') {
          <div
            class="animate-spin rounded-full border-solid"
            [class]="getBorderSpinnerClasses()"
          ></div>
        }
        @case ('grow') {
          <div
            class="animate-ping rounded-full"
            [class]="getGrowSpinnerClasses()"
          ></div>
        }
        @case ('dots') {
          <div class="flex space-x-1">
            @for (i of [1, 2, 3]; track i) {
              <div
                class="animate-bounce rounded-full"
                [class]="getDotsSpinnerClasses()"
                [style.animation-delay]="(i - 1) * 0.2 + 's'"
              ></div>
            }
          </div>
        }
        @case ('pulse') {
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
        @case ('wave') {
          <div class="flex items-center space-x-0.5">
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <div
                class="animate-wave"
                [class]="getWaveSpinnerClasses()"
                [style.animation-delay]="(i - 1) * 0.1 + 's'"
              ></div>
            }
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
    @keyframes wave {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(2); }
    }

    .animate-wave {
      animation: wave 1s ease-in-out infinite;
      transform-origin: center bottom;
    }
  `]
})
export class SpinnerComponent {
  @Input() type: SpinnerType = 'border';
  @Input() size: SpinnerSize = 'md';
  @Input() color: SpinnerColor = 'primary';
  @Input() label = '';
  @Input() dimmed = false;

  private readonly sizeMap = {
    sm: {
      border: 'w-4 h-4 border-2',
      grow: 'w-2 h-2',
      dots: 'w-1.5 h-1.5',
      pulse: 'w-3 h-3',
      wave: 'w-1 h-4'
    },
    md: {
      border: 'w-6 h-6 border-3',
      grow: 'w-3 h-3',
      dots: 'w-2 h-2',
      pulse: 'w-4 h-4',
      wave: 'w-1.5 h-6'
    },
    lg: {
      border: 'w-8 h-8 border-4',
      grow: 'w-4 h-4',
      dots: 'w-2.5 h-2.5',
      pulse: 'w-5 h-5',
      wave: 'w-2 h-8'
    },
    xl: {
      border: 'w-12 h-12 border-4',
      grow: 'w-6 h-6',
      dots: 'w-3 h-3',
      pulse: 'w-6 h-6',
      wave: 'w-2.5 h-12'
    }
  };

  private readonly colorMap = {
    primary: 'border-primary-500 text-primary-500 bg-primary-500',
    secondary: 'border-gray-500 text-gray-500 bg-gray-500',
    success: 'border-green-500 text-green-500 bg-green-500',
    danger: 'border-red-500 text-red-500 bg-red-500',
    warning: 'border-yellow-500 text-yellow-500 bg-yellow-500',
    info: 'border-blue-500 text-blue-500 bg-blue-500'
  };

  getBorderSpinnerClasses(): string {
    return `
      ${this.sizeMap[this.size].border}
      border-t-transparent
      ${this.colorMap[this.color].split(' ')[0]}
    `;
  }

  getGrowSpinnerClasses(): string {
    return `
      ${this.sizeMap[this.size].grow}
      ${this.colorMap[this.color].split(' ')[2]}
    `;
  }

  getDotsSpinnerClasses(): string {
    return `
      ${this.sizeMap[this.size].dots}
      ${this.colorMap[this.color].split(' ')[2]}
    `;
  }

  getPulseSpinnerClasses(): string {
    return `
      ${this.sizeMap[this.size].pulse}
      ${this.colorMap[this.color].split(' ')[2]}
    `;
  }

  getWaveSpinnerClasses(): string {
    return `
      ${this.sizeMap[this.size].wave}
      ${this.colorMap[this.color].split(' ')[2]}
    `;
  }

  getLabelClasses(): string {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };

    return `
      ${sizes[this.size]}
      ${this.colorMap[this.color].split(' ')[1]}
      font-medium
    `;
  }

  // Helper method to set type
  setType(type: SpinnerType): void {
    this.type = type;
  }

  // Helper method to set size
  setSize(size: SpinnerSize): void {
    this.size = size;
  }

  // Helper method to set color
  setColor(color: SpinnerColor): void {
    this.color = color;
  }

  // Helper method to set label
  setLabel(label: string): void {
    this.label = label;
  }

  // Helper method to toggle dimmed state
  toggleDimmed(): void {
    this.dimmed = !this.dimmed;
  }

  // Helper method to get spinner dimensions
  getDimensions(): { width: number; height: number } {
    const sizeClasses = this.sizeMap[this.size][this.type];
    const width = parseInt(sizeClasses.match(/w-(\d+)/)?.[1] || '0');
    const height = parseInt(sizeClasses.match(/h-(\d+)/)?.[1] || '0');
    return { width, height };
  }

  // Helper method to get animation duration
  getAnimationDuration(): number {
    switch (this.type) {
      case 'border':
        return 750;
      case 'grow':
        return 1000;
      case 'dots':
        return 600;
      case 'pulse':
        return 1000;
      case 'wave':
        return 1000;
      default:
        return 0;
    }
  }

  // Helper method to check if spinner is animated
  isAnimated(): boolean {
    return ['border', 'grow', 'dots', 'pulse', 'wave'].includes(this.type);
  }

  // Helper method to get accessibility label
  getAriaLabel(): string {
    return this.label || 'Loading...';
  }

  // Helper method to get color scheme
  getColorScheme(): { border: string; text: string; background: string } {
    const [border, text, background] = this.colorMap[this.color].split(' ');
    return { border, text, background };
  }
}