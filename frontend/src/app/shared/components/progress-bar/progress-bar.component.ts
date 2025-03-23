import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ProgressVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getContainerClasses()">
      <!-- Label -->
      @if (showLabel) {
        <div class="flex justify-between mb-1">
          <span class="text-sm font-medium text-gray-700">{{ label }}</span>
          @if (showPercentage) {
            <span class="text-sm font-medium text-gray-700">{{ value }}%</span>
          }
        </div>
      }

      <!-- Progress Bar -->
      <div class="relative">
        <!-- Background -->
        <div
          class="w-full rounded-full"
          [class]="getBackgroundClasses()"
        >
          <!-- Progress -->
          <div
            class="rounded-full transition-all duration-300 ease-in-out"
            [class]="getProgressClasses()"
            [style.width.%]="value"
          >
            <!-- Indeterminate Animation -->
            @if (indeterminate) {
              <div class="absolute inset-0">
                <div class="animate-progress-indeterminate h-full w-1/3 rounded-full bg-white bg-opacity-20"></div>
              </div>
            }

            <!-- Label Inside -->
            @if (showPercentage && labelPosition === 'inside' && value >= 10) {
              <span
                class="absolute inset-0 flex items-center justify-center text-white text-sm font-medium"
                [class.text-xs]="size === 'xs' || size === 'sm'"
              >
                {{ value }}%
              </span>
            }
          </div>
        </div>

        <!-- Stripes Animation -->
        @if (striped) {
          <div
            class="absolute inset-0 overflow-hidden rounded-full"
            [class.animate-progress-stripes]="animated"
          >
            <div
              class="absolute inset-0 bg-stripes"
              [style.width.%]="value"
            ></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes progress-stripes {
      from {
        background-position: 1rem 0;
      }
      to {
        background-position: 0 0;
      }
    }

    @keyframes progress-indeterminate {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(400%);
      }
    }

    .animate-progress-stripes {
      animation: progress-stripes 1s linear infinite;
    }

    .animate-progress-indeterminate {
      animation: progress-indeterminate 1.5s ease-in-out infinite;
    }

    .bg-stripes {
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      background-size: 1rem 1rem;
    }
  `]
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() size: ProgressSize = 'md';
  @Input() variant: ProgressVariant = 'primary';
  @Input() label = '';
  @Input() showLabel = false;
  @Input() showPercentage = false;
  @Input() labelPosition: 'top' | 'inside' = 'top';
  @Input() striped = false;
  @Input() animated = false;
  @Input() indeterminate = false;
  @Input() rounded = true;

  getContainerClasses(): string {
    return `w-full ${this.showLabel ? 'space-y-1' : ''}`;
  }

  getBackgroundClasses(): string {
    const sizeClasses = {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
      xl: 'h-5'
    };

    return `
      ${sizeClasses[this.size]}
      bg-gray-200
      ${this.rounded ? 'rounded-full' : ''}
      overflow-hidden
    `;
  }

  getProgressClasses(): string {
    const variantClasses = {
      primary: 'bg-primary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      error: 'bg-error-600',
      info: 'bg-info-600'
    };

    return `
      h-full
      ${variantClasses[this.variant]}
      ${this.rounded ? 'rounded-full' : ''}
      ${this.indeterminate ? 'relative overflow-hidden' : ''}
    `;
  }

  // Helper method to set value
  setValue(value: number): void {
    this.value = Math.min(Math.max(value, 0), 100);
  }

  // Helper method to increment value
  increment(amount = 1): void {
    this.setValue(this.value + amount);
  }

  // Helper method to decrement value
  decrement(amount = 1): void {
    this.setValue(this.value - amount);
  }

  // Helper method to set size
  setSize(size: ProgressSize): void {
    this.size = size;
  }

  // Helper method to set variant
  setVariant(variant: ProgressVariant): void {
    this.variant = variant;
  }

  // Helper method to set label
  setLabel(label: string): void {
    this.label = label;
  }

  // Helper method to toggle label
  toggleLabel(show: boolean): void {
    this.showLabel = show;
  }

  // Helper method to toggle percentage
  togglePercentage(show: boolean): void {
    this.showPercentage = show;
  }

  // Helper method to set label position
  setLabelPosition(position: 'top' | 'inside'): void {
    this.labelPosition = position;
  }

  // Helper method to toggle striped
  toggleStriped(striped: boolean): void {
    this.striped = striped;
  }

  // Helper method to toggle animation
  toggleAnimation(animated: boolean): void {
    this.animated = animated;
  }

  // Helper method to toggle indeterminate
  toggleIndeterminate(indeterminate: boolean): void {
    this.indeterminate = indeterminate;
  }

  // Helper method to toggle rounded
  toggleRounded(rounded: boolean): void {
    this.rounded = rounded;
  }

  // Helper method to get status
  getStatus(): 'success' | 'warning' | 'error' | null {
    if (this.value >= 100) return 'success';
    if (this.value >= 80) return 'warning';
    if (this.value < 20) return 'error';
    return null;
  }

  // Helper method to check if complete
  isComplete(): boolean {
    return this.value >= 100;
  }

  // Helper method to reset
  reset(): void {
    this.value = 0;
  }

  // Helper method to format value
  formatValue(): string {
    return `${Math.round(this.value)}%`;
  }

  // Helper method to get normalized value
  getNormalizedValue(): number {
    return this.value / 100;
  }
}