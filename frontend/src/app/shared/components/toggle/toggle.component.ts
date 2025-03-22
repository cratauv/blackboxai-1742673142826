import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ToggleSize = 'sm' | 'md' | 'lg';
type ToggleVariant = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center">
      <!-- Left Label -->
      @if (label && labelPosition === 'left') {
        <label 
          [for]="id" 
          class="mr-3 select-none"
          [class]="getLabelClasses()"
        >
          {{ label }}
        </label>
      }

      <!-- Toggle Button -->
      <button
        type="button"
        role="switch"
        [id]="id"
        [attr.aria-checked]="checked"
        [attr.aria-label]="ariaLabel || label"
        [disabled]="disabled"
        (click)="toggle()"
        class="group relative inline-flex shrink-0 cursor-pointer items-center outline-none transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        [class]="getToggleClasses()"
      >
        <!-- Background -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute mx-auto h-full w-full rounded-full transition-colors duration-200 ease-in-out"
          [class]="getBackgroundClasses()"
        ></span>

        <!-- Toggle Handle -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          [class]="getHandleClasses()"
        >
          @if (icon) {
            <span 
              class="flex h-full w-full items-center justify-center"
              [class]="getIconClasses()"
            >
              <i [class]="icon"></i>
            </span>
          }
        </span>
      </button>

      <!-- Right Label -->
      @if (label && labelPosition === 'right') {
        <label 
          [for]="id" 
          class="ml-3 select-none"
          [class]="getLabelClasses()"
        >
          {{ label }}
        </label>
      }

      <!-- Description -->
      @if (description) {
        <span class="ml-3 text-sm text-gray-500">{{ description }}</span>
      }
    </div>
  `
})
export class ToggleComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() size: ToggleSize = 'md';
  @Input() variant: ToggleVariant = 'primary';
  @Input() label = '';
  @Input() labelPosition: 'left' | 'right' = 'right';
  @Input() description = '';
  @Input() icon = '';
  @Input() ariaLabel = '';
  @Input() id = `toggle-${Math.random().toString(36).substr(2, 9)}`;

  @Output() checkedChange = new EventEmitter<boolean>();

  toggle(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checked);
    }
  }

  getToggleClasses(): string {
    const sizes = {
      sm: 'h-5 w-9',
      md: 'h-6 w-11',
      lg: 'h-7 w-14'
    };
    return sizes[this.size];
  }

  getBackgroundClasses(): string {
    const baseClasses = this.checked ? this.getActiveBackgroundColor() : 'bg-gray-200';
    return baseClasses;
  }

  getHandleClasses(): string {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const positions = {
      sm: this.checked ? 'translate-x-4' : 'translate-x-1',
      md: this.checked ? 'translate-x-5' : 'translate-x-1',
      lg: this.checked ? 'translate-x-7' : 'translate-x-1'
    };

    return `${sizes[this.size]} ${positions[this.size]}`;
  }

  getIconClasses(): string {
    const sizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    return `${sizes[this.size]} ${this.checked ? 'text-primary-600' : 'text-gray-400'}`;
  }

  getLabelClasses(): string {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    return `${sizes[this.size]} ${this.disabled ? 'text-gray-400' : 'text-gray-900'}`;
  }

  private getActiveBackgroundColor(): string {
    const colors = {
      primary: 'bg-primary-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600'
    };
    return colors[this.variant];
  }

  // Helper method to get hover background color
  getHoverBackgroundColor(): string {
    if (this.disabled) return '';

    const colors = {
      primary: 'hover:bg-primary-700',
      success: 'hover:bg-green-700',
      warning: 'hover:bg-yellow-700',
      danger: 'hover:bg-red-700'
    };
    return colors[this.variant];
  }

  // Helper method to get focus ring color
  getFocusRingColor(): string {
    const colors = {
      primary: 'focus:ring-primary-500',
      success: 'focus:ring-green-500',
      warning: 'focus:ring-yellow-500',
      danger: 'focus:ring-red-500'
    };
    return colors[this.variant];
  }

  // Helper method to get handle position
  getHandlePosition(): string {
    const positions = {
      sm: { start: '0.25rem', end: '1rem' },
      md: { start: '0.25rem', end: '1.25rem' },
      lg: { start: '0.25rem', end: '1.75rem' }
    };
    return this.checked ? positions[this.size].end : positions[this.size].start;
  }

  // Helper method to get handle size
  getHandleSize(): string {
    const sizes = {
      sm: '1rem',
      md: '1.25rem',
      lg: '1.5rem'
    };
    return sizes[this.size];
  }

  // Helper method to get track width
  getTrackWidth(): string {
    const widths = {
      sm: '2.25rem',
      md: '2.75rem',
      lg: '3.5rem'
    };
    return widths[this.size];
  }

  // Helper method to get track height
  getTrackHeight(): string {
    const heights = {
      sm: '1.25rem',
      md: '1.5rem',
      lg: '1.75rem'
    };
    return heights[this.size];
  }
}