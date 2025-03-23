import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'light' | 'dark';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      role="status"
      [class]="getContainerClasses()"
    >
      <!-- Spinner -->
      @if (type === 'border') {
        <div
          [class]="getBorderSpinnerClasses()"
          [style.width]="size + 'px'"
          [style.height]="size + 'px'"
          [style.borderWidth]="thickness + 'px'"
        ></div>
      } @else {
        <div
          [class]="getGrowSpinnerClasses()"
          [style.width]="size + 'px'"
          [style.height]="size + 'px'"
        >
          @for (dot of [1, 2, 3, 4]; track dot) {
            <div [class]="getDotClasses()"></div>
          }
        </div>
      }

      <!-- Label -->
      @if (label) {
        <span [class]="getLabelClasses()">
          {{ label }}
        </span>
      }

      <!-- Screen Reader Text -->
      <span class="sr-only">{{ srText }}</span>
    </div>
  `,
  styles: [`
    @keyframes spinner-border {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes spinner-grow {
      0% {
        transform: scale(0);
      }
      50% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0);
      }
    }

    .animate-spin {
      animation: spinner-border 0.75s linear infinite;
    }

    .animate-grow {
      animation: spinner-grow 0.75s linear infinite;
    }

    .animate-grow-delay-1 {
      animation-delay: 0.1s;
    }

    .animate-grow-delay-2 {
      animation-delay: 0.2s;
    }

    .animate-grow-delay-3 {
      animation-delay: 0.3s;
    }
  `]
})
export class SpinnerComponent {
  @Input() type: 'border' | 'grow' = 'border';
  @Input() variant: SpinnerVariant = 'primary';
  @Input() size: number = 24;
  @Input() thickness: number = 2;
  @Input() label = '';
  @Input() labelPosition: 'left' | 'right' = 'right';
  @Input() srText = 'Loading...';
  @Input() centered = false;

  getContainerClasses(): string {
    return `
      inline-flex items-center
      ${this.centered ? 'justify-center' : ''}
      ${this.labelPosition === 'right' ? 'space-x-2' : 'space-x-reverse space-x-2 flex-row-reverse'}
    `;
  }

  getBorderSpinnerClasses(): string {
    const variantClasses = {
      primary: 'border-primary-600 border-t-transparent',
      secondary: 'border-gray-600 border-t-transparent',
      success: 'border-success-600 border-t-transparent',
      warning: 'border-warning-600 border-t-transparent',
      error: 'border-error-600 border-t-transparent',
      info: 'border-info-600 border-t-transparent',
      light: 'border-gray-200 border-t-transparent',
      dark: 'border-gray-800 border-t-transparent'
    };

    return `
      inline-block rounded-full
      animate-spin
      ${variantClasses[this.variant]}
    `;
  }

  getGrowSpinnerClasses(): string {
    return `
      relative inline-flex
      ${this.centered ? 'justify-center' : ''}
    `;
  }

  getDotClasses(): string {
    const variantClasses = {
      primary: 'bg-primary-600',
      secondary: 'bg-gray-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      error: 'bg-error-600',
      info: 'bg-info-600',
      light: 'bg-gray-200',
      dark: 'bg-gray-800'
    };

    return `
      absolute w-1/4 h-1/4 rounded-full
      animate-grow opacity-0
      ${variantClasses[this.variant]}
    `;
  }

  getLabelClasses(): string {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };

    const size = this.getSizeClass();
    return `${sizeClasses[size]} font-medium text-gray-900`;
  }

  private getSizeClass(): SpinnerSize {
    if (this.size <= 16) return 'xs';
    if (this.size <= 20) return 'sm';
    if (this.size <= 24) return 'md';
    if (this.size <= 32) return 'lg';
    return 'xl';
  }

  // Helper method to set type
  setType(type: 'border' | 'grow'): void {
    this.type = type;
  }

  // Helper method to set variant
  setVariant(variant: SpinnerVariant): void {
    this.variant = variant;
  }

  // Helper method to set size
  setSize(size: number): void {
    this.size = size;
  }

  // Helper method to set thickness
  setThickness(thickness: number): void {
    this.thickness = thickness;
  }

  // Helper method to set label
  setLabel(label: string): void {
    this.label = label;
  }

  // Helper method to set label position
  setLabelPosition(position: 'left' | 'right'): void {
    this.labelPosition = position;
  }

  // Helper method to set screen reader text
  setSrText(text: string): void {
    this.srText = text;
  }

  // Helper method to toggle centered
  toggleCentered(centered: boolean): void {
    this.centered = centered;
  }

  // Helper method to get size in pixels
  getSizeInPixels(): number {
    return this.size;
  }

  // Helper method to get thickness in pixels
  getThicknessInPixels(): number {
    return this.thickness;
  }

  // Helper method to check if has label
  hasLabel(): boolean {
    return !!this.label;
  }

  // Helper method to get animation duration
  getAnimationDuration(): string {
    return '0.75s';
  }

  // Helper method to get animation timing
  getAnimationTiming(): string {
    return 'linear';
  }
}