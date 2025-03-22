import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger';
type ProgressType = 'bar' | 'circle';
type ProgressSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <!-- Label -->
      @if (showLabel) {
        <div class="mb-1 flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">{{ label }}</span>
          @if (showPercentage) {
            <span class="text-sm font-medium text-gray-700">{{ value }}%</span>
          }
        </div>
      }

      <!-- Bar Progress -->
      @if (type === 'bar') {
        <div 
          class="overflow-hidden rounded-full bg-gray-200"
          [class]="getBarSizeClasses()"
        >
          <div
            class="transition-all duration-300 ease-in-out"
            [class]="getProgressClasses()"
            [style.width.%]="value"
          >
            @if (showValueInBar) {
              <span class="ml-2 text-white">{{ value }}%</span>
            }
          </div>
        </div>
      }

      <!-- Circular Progress -->
      @if (type === 'circle') {
        <div 
          class="relative inline-flex items-center justify-center"
          [class]="getCircleSizeClasses()"
        >
          <!-- Background Circle -->
          <svg class="absolute" [class]="getCircleSizeClasses()">
            <circle
              cx="50%"
              cy="50%"
              [attr.r]="getCircleRadius()"
              fill="none"
              class="text-gray-200"
              [attr.stroke-width]="getStrokeWidth()"
              stroke="currentColor"
            />
          </svg>

          <!-- Progress Circle -->
          <svg class="absolute -rotate-90" [class]="getCircleSizeClasses()">
            <circle
              cx="50%"
              cy="50%"
              [attr.r]="getCircleRadius()"
              fill="none"
              [class]="getCircleProgressClasses()"
              [attr.stroke-width]="getStrokeWidth()"
              stroke="currentColor"
              [attr.stroke-dasharray]="getCircleCircumference()"
              [attr.stroke-dashoffset]="getCircleOffset()"
            />
          </svg>

          <!-- Center Content -->
          @if (showPercentage) {
            <span 
              class="absolute font-medium"
              [class]="getCircleTextClasses()"
            >
              {{ value }}%
            </span>
          }
        </div>
      }

      <!-- Description -->
      @if (description) {
        <p class="mt-1 text-sm text-gray-500">{{ description }}</p>
      }
    </div>
  `
})
export class ProgressComponent {
  @Input() value = 0;
  @Input() type: ProgressType = 'bar';
  @Input() variant: ProgressVariant = 'primary';
  @Input() size: ProgressSize = 'md';
  @Input() label = '';
  @Input() description = '';
  @Input() showLabel = true;
  @Input() showPercentage = true;
  @Input() showValueInBar = false;
  @Input() animated = true;

  getBarSizeClasses(): string {
    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4'
    };
    return sizes[this.size];
  }

  getProgressClasses(): string {
    const baseClasses = 'h-full';
    const animationClass = this.animated ? 'transition-all duration-300' : '';
    
    const variants = {
      primary: 'bg-primary-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600'
    };

    return `${baseClasses} ${variants[this.variant]} ${animationClass}`;
  }

  getCircleSizeClasses(): string {
    const sizes = {
      sm: 'h-16 w-16',
      md: 'h-24 w-24',
      lg: 'h-32 w-32'
    };
    return sizes[this.size];
  }

  getCircleProgressClasses(): string {
    const variants = {
      primary: 'text-primary-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      danger: 'text-red-600'
    };
    return variants[this.variant];
  }

  getCircleTextClasses(): string {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    return sizes[this.size];
  }

  getStrokeWidth(): number {
    const widths = {
      sm: 4,
      md: 6,
      lg: 8
    };
    return widths[this.size];
  }

  getCircleRadius(): number {
    const radius = {
      sm: 24,
      md: 36,
      lg: 48
    };
    return radius[this.size];
  }

  getCircleCircumference(): number {
    return 2 * Math.PI * this.getCircleRadius();
  }

  getCircleOffset(): number {
    const circumference = this.getCircleCircumference();
    return circumference - (this.value / 100) * circumference;
  }

  // Helper method to get normalized value
  getNormalizedValue(): number {
    return Math.min(Math.max(this.value, 0), 100);
  }

  // Helper method to get status
  getStatus(): 'success' | 'warning' | 'danger' | undefined {
    if (this.value >= 100) return 'success';
    if (this.value >= 80) return 'warning';
    if (this.value < 20) return 'danger';
    return undefined;
  }

  // Helper method to get color based on value
  getColorByValue(): string {
    if (this.value >= 100) return 'bg-green-600';
    if (this.value >= 80) return 'bg-yellow-600';
    if (this.value < 20) return 'bg-red-600';
    return 'bg-primary-600';
  }

  // Helper method to format value
  formatValue(): string {
    return `${Math.round(this.value)}%`;
  }

  // Helper method to check if progress is complete
  isComplete(): boolean {
    return this.value >= 100;
  }

  // Helper method to check if progress is in warning state
  isWarning(): boolean {
    return this.value >= 80 && this.value < 100;
  }

  // Helper method to check if progress is in danger state
  isDanger(): boolean {
    return this.value < 20;
  }
}