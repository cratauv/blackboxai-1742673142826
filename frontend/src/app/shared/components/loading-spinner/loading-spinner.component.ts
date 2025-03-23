import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      [class.bg-black]="overlay"
      [class.bg-opacity-50]="overlay"
    >
      <div class="relative">
        <!-- Spinner -->
        <div class="animate-spin rounded-full border-4 border-gray-200" [ngStyle]="spinnerStyles">
          <div
            class="absolute top-0 left-0 rounded-full border-4 border-primary-600"
            [ngStyle]="arcStyles"
          ></div>
        </div>

        <!-- Message -->
        @if (message) {
          <div
            class="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 text-center"
            [class.text-white]="overlay"
            [class.text-gray-900]="!overlay"
          >
            <p class="text-sm font-medium">{{ message }}</p>
            @if (showProgress) {
              <div class="mt-2 w-48">
                <div class="bg-gray-200 rounded-full h-1.5">
                  <div
                    class="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                    [style.width.%]="progress"
                  ></div>
                </div>
                <p class="mt-1 text-xs">{{ progress }}%</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size = 40;
  @Input() thickness = 4;
  @Input() color = '#0ea5e9';
  @Input() message?: string;
  @Input() overlay = true;
  @Input() showProgress = false;
  @Input() progress = 0;

  get spinnerStyles(): { [key: string]: string } {
    return {
      width: `${this.size}px`,
      height: `${this.size}px`,
      borderWidth: `${this.thickness}px`
    };
  }

  get arcStyles(): { [key: string]: string } {
    return {
      width: `${this.size}px`,
      height: `${this.size}px`,
      borderWidth: `${this.thickness}px`,
      borderTopColor: this.color,
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent'
    };
  }

  // Helper method to update progress
  updateProgress(value: number): void {
    this.progress = Math.min(100, Math.max(0, value));
  }

  // Helper method to show determinate progress
  setDeterminate(show: boolean): void {
    this.showProgress = show;
  }

  // Helper method to update message
  updateMessage(message: string): void {
    this.message = message;
  }

  // Helper method to toggle overlay
  toggleOverlay(show: boolean): void {
    this.overlay = show;
  }

  // Helper method to set size
  setSize(size: number): void {
    this.size = size;
  }

  // Helper method to set thickness
  setThickness(thickness: number): void {
    this.thickness = thickness;
  }

  // Helper method to set color
  setColor(color: string): void {
    this.color = color;
  }

  // Helper method to reset to default state
  reset(): void {
    this.progress = 0;
    this.showProgress = false;
    this.message = undefined;
    this.size = 40;
    this.thickness = 4;
    this.color = '#0ea5e9';
    this.overlay = true;
  }

  // Helper method to show success state
  showSuccess(message?: string): void {
    this.color = '#22c55e';
    this.progress = 100;
    if (message) {
      this.message = message;
    }
  }

  // Helper method to show error state
  showError(message?: string): void {
    this.color = '#ef4444';
    if (message) {
      this.message = message;
    }
  }

  // Helper method to show warning state
  showWarning(message?: string): void {
    this.color = '#f59e0b';
    if (message) {
      this.message = message;
    }
  }

  // Helper method to pulse animation
  pulse(): void {
    const originalSize = this.size;
    const pulseSize = originalSize * 1.2;
    
    this.size = pulseSize;
    setTimeout(() => {
      this.size = originalSize;
    }, 200);
  }

  // Helper method to set custom styles
  setCustomStyles(styles: { [key: string]: string }): void {
    Object.assign(this.spinnerStyles, styles);
  }
}