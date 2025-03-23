import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ChipVariant = 'filled' | 'outlined' | 'soft';
type ChipSize = 'sm' | 'md' | 'lg';
type ChipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="getChipClasses()"
      [attr.data-testid]="testId"
    >
      <!-- Leading Icon -->
      @if (iconLeft) {
        <i [class]="iconLeft + ' ' + getIconClasses()"></i>
      }

      <!-- Avatar -->
      @if (avatar) {
        <img
          [src]="avatar"
          [alt]="label"
          class="w-5 h-5 rounded-full object-cover"
        >
      }

      <!-- Label -->
      <span [class]="getLabelClasses()">{{ label }}</span>

      <!-- Trailing Icon -->
      @if (iconRight) {
        <i [class]="iconRight + ' ' + getIconClasses()"></i>
      }

      <!-- Delete Button -->
      @if (deletable) {
        <button
          type="button"
          class="ml-1 focus:outline-none"
          (click)="onDelete($event)"
          [attr.aria-label]="'Remove ' + label"
        >
          <i class="fas fa-times" [class]="getDeleteIconClasses()"></i>
        </button>
      }
    </div>
  `
})
export class ChipComponent {
  @Input() label = '';
  @Input() variant: ChipVariant = 'filled';
  @Input() color: ChipColor = 'primary';
  @Input() size: ChipSize = 'md';
  @Input() iconLeft = '';
  @Input() iconRight = '';
  @Input() avatar = '';
  @Input() deletable = false;
  @Input() disabled = false;
  @Input() clickable = false;
  @Input() testId = '';

  @Output() delete = new EventEmitter<void>();
  @Output() click = new EventEmitter<void>();

  getChipClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center';
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    const variantClasses = {
      filled: this.getFilledClasses(),
      outlined: this.getOutlinedClasses(),
      soft: this.getSoftClasses()
    };

    const stateClasses = this.getStateClasses();

    return `
      ${baseClasses}
      ${sizeClasses[this.size]}
      ${variantClasses[this.variant]}
      ${stateClasses}
      rounded-full
      transition-all duration-200
    `;
  }

  private getFilledClasses(): string {
    const colorClasses = {
      primary: 'bg-primary-600 text-white',
      secondary: 'bg-gray-600 text-white',
      success: 'bg-success-600 text-white',
      warning: 'bg-warning-600 text-white',
      error: 'bg-error-600 text-white',
      info: 'bg-info-600 text-white'
    };

    return colorClasses[this.color];
  }

  private getOutlinedClasses(): string {
    const colorClasses = {
      primary: 'border border-primary-600 text-primary-600',
      secondary: 'border border-gray-600 text-gray-600',
      success: 'border border-success-600 text-success-600',
      warning: 'border border-warning-600 text-warning-600',
      error: 'border border-error-600 text-error-600',
      info: 'border border-info-600 text-info-600'
    };

    return colorClasses[this.color];
  }

  private getSoftClasses(): string {
    const colorClasses = {
      primary: 'bg-primary-50 text-primary-700',
      secondary: 'bg-gray-50 text-gray-700',
      success: 'bg-success-50 text-success-700',
      warning: 'bg-warning-50 text-warning-700',
      error: 'bg-error-50 text-error-700',
      info: 'bg-info-50 text-info-700'
    };

    return colorClasses[this.color];
  }

  private getStateClasses(): string {
    const classes = [];

    if (this.disabled) {
      classes.push('opacity-50 cursor-not-allowed');
    } else if (this.clickable) {
      classes.push('cursor-pointer hover:opacity-80');
    }

    return classes.join(' ');
  }

  getIconClasses(): string {
    return this.size === 'sm' ? 'text-xs' : 'text-sm';
  }

  getLabelClasses(): string {
    return `font-medium ${this.iconLeft || this.avatar ? 'ml-1.5' : ''} ${this.iconRight ? 'mr-1.5' : ''}`;
  }

  getDeleteIconClasses(): string {
    const baseClasses = 'hover:opacity-75 transition-opacity';
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };

    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.delete.emit();
    }
  }

  onClick(): void {
    if (!this.disabled && this.clickable) {
      this.click.emit();
    }
  }

  // Helper method to set variant
  setVariant(variant: ChipVariant): void {
    this.variant = variant;
  }

  // Helper method to set color
  setColor(color: ChipColor): void {
    this.color = color;
  }

  // Helper method to set size
  setSize(size: ChipSize): void {
    this.size = size;
  }

  // Helper method to set label
  setLabel(label: string): void {
    this.label = label;
  }

  // Helper method to set icons
  setIcons(leftIcon?: string, rightIcon?: string): void {
    this.iconLeft = leftIcon || '';
    this.iconRight = rightIcon || '';
  }

  // Helper method to set avatar
  setAvatar(avatar: string): void {
    this.avatar = avatar;
  }

  // Helper method to toggle deletable
  toggleDeletable(deletable: boolean): void {
    this.deletable = deletable;
  }

  // Helper method to toggle disabled
  toggleDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  // Helper method to toggle clickable
  toggleClickable(clickable: boolean): void {
    this.clickable = clickable;
  }

  // Helper method to check if has icon
  hasIcon(): boolean {
    return !!(this.iconLeft || this.iconRight);
  }

  // Helper method to check if has avatar
  hasAvatar(): boolean {
    return !!this.avatar;
  }

  // Helper method to get current state
  getState(): 'default' | 'disabled' | 'clickable' {
    if (this.disabled) return 'disabled';
    if (this.clickable) return 'clickable';
    return 'default';
  }
}