import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ToggleSize = 'sm' | 'md' | 'lg';
type ToggleColor = 'primary' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inline-flex items-center">
      <!-- Label (Left) -->
      @if (label && labelPosition === 'left') {
        <label
          [for]="id"
          [class]="getLabelClasses()"
        >
          {{ label }}
        </label>
      }

      <!-- Toggle Button -->
      <button
        [id]="id"
        type="button"
        role="switch"
        [attr.aria-checked]="checked"
        [attr.aria-label]="ariaLabel || label"
        [class]="getToggleClasses()"
        [disabled]="disabled"
        (click)="onToggle()"
      >
        <span
          class="pointer-events-none inline-block h-full aspect-square rounded-full bg-white shadow transform ring-0 transition-transform duration-200 ease-in-out"
          [class]="getKnobClasses()"
        >
          @if (loading) {
            <span class="absolute inset-0 flex items-center justify-center">
              <i class="fas fa-spinner animate-spin text-gray-400" [class]="getSpinnerClasses()"></i>
            </span>
          }
          @if (icons && !loading) {
            <span class="absolute inset-0 flex items-center justify-center">
              <i
                [class]="(checked ? icons.on : icons.off) + ' ' + getIconClasses()"
                [style.color]="checked ? color : 'currentColor'"
              ></i>
            </span>
          }
        </span>
      </button>

      <!-- Label (Right) -->
      @if (label && labelPosition === 'right') {
        <label
          [for]="id"
          [class]="getLabelClasses()"
        >
          {{ label }}
        </label>
      }

      <!-- Description -->
      @if (description) {
        <span class="ml-2 text-sm text-gray-500">
          {{ description }}
        </span>
      }
    </div>
  `,
  styles: [`
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class ToggleComponent {
  @Input() id = `toggle-${Math.random().toString(36).substr(2, 9)}`;
  @Input() checked = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() size: ToggleSize = 'md';
  @Input() color: ToggleColor = 'primary';
  @Input() label = '';
  @Input() labelPosition: 'left' | 'right' = 'right';
  @Input() description = '';
  @Input() ariaLabel = '';
  @Input() icons?: { on: string; off: string };

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() change = new EventEmitter<boolean>();

  getToggleClasses(): string {
    const baseClasses = 'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeClasses = {
      sm: 'w-9 h-5',
      md: 'w-11 h-6',
      lg: 'w-14 h-7'
    };

    const colorClasses = {
      primary: 'bg-primary-600 focus:ring-primary-500',
      success: 'bg-success-600 focus:ring-success-500',
      warning: 'bg-warning-600 focus:ring-warning-500',
      error: 'bg-error-600 focus:ring-error-500',
      info: 'bg-info-600 focus:ring-info-500'
    };

    const stateClasses = this.getStateClasses();

    return `
      ${baseClasses}
      ${sizeClasses[this.size]}
      ${this.checked ? colorClasses[this.color] : 'bg-gray-200'}
      ${stateClasses}
    `;
  }

  private getStateClasses(): string {
    const classes = [];

    if (this.disabled) {
      classes.push('opacity-50 cursor-not-allowed');
    }
    if (this.loading) {
      classes.push('cursor-wait');
    }

    return classes.join(' ');
  }

  getKnobClasses(): string {
    const translateX = {
      sm: this.checked ? 'translate-x-4' : 'translate-x-0',
      md: this.checked ? 'translate-x-5' : 'translate-x-0',
      lg: this.checked ? 'translate-x-7' : 'translate-x-0'
    };

    return translateX[this.size];
  }

  getLabelClasses(): string {
    const marginClasses = {
      left: 'mr-3',
      right: 'ml-3'
    };

    return `
      text-sm font-medium text-gray-900
      ${this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${marginClasses[this.labelPosition]}
    `;
  }

  getIconClasses(): string {
    return {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }[this.size];
  }

  getSpinnerClasses(): string {
    return {
      sm: 'text-[8px]',
      md: 'text-[10px]',
      lg: 'text-xs'
    }[this.size];
  }

  onToggle(): void {
    if (!this.disabled && !this.loading) {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checked);
      this.change.emit(this.checked);
    }
  }

  // Helper method to set checked state
  setChecked(checked: boolean): void {
    if (this.checked !== checked) {
      this.checked = checked;
      this.checkedChange.emit(this.checked);
      this.change.emit(this.checked);
    }
  }

  // Helper method to toggle checked state
  toggle(): void {
    this.onToggle();
  }

  // Helper method to set disabled state
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  // Helper method to set loading state
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  // Helper method to set size
  setSize(size: ToggleSize): void {
    this.size = size;
  }

  // Helper method to set color
  setColor(color: ToggleColor): void {
    this.color = color;
  }

  // Helper method to set label
  setLabel(label: string, position: 'left' | 'right' = 'right'): void {
    this.label = label;
    this.labelPosition = position;
  }

  // Helper method to set description
  setDescription(description: string): void {
    this.description = description;
  }

  // Helper method to set icons
  setIcons(onIcon: string, offIcon: string): void {
    this.icons = { on: onIcon, off: offIcon };
  }

  // Helper method to get current state
  getState(): 'checked' | 'unchecked' | 'disabled' | 'loading' {
    if (this.loading) return 'loading';
    if (this.disabled) return 'disabled';
    return this.checked ? 'checked' : 'unchecked';
  }

  // Helper method to check if interactive
  isInteractive(): boolean {
    return !this.disabled && !this.loading;
  }
}