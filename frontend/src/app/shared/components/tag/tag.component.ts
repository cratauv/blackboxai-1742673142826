import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type TagVariant = 'solid' | 'outlined' | 'soft';
type TagSize = 'sm' | 'md' | 'lg';
type TagColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="getTagClasses()"
      [attr.data-testid]="testId"
    >
      <!-- Icon -->
      @if (icon) {
        <i [class]="icon + ' ' + getIconClasses()"></i>
      }

      <!-- Dot -->
      @if (showDot) {
        <span
          class="w-2 h-2 rounded-full"
          [class]="getDotClasses()"
        ></span>
      }

      <!-- Label -->
      <span [class]="getLabelClasses()">{{ label }}</span>

      <!-- Close Button -->
      @if (closable && !disabled) {
        <button
          type="button"
          class="ml-1 focus:outline-none"
          (click)="onClose($event)"
          [attr.aria-label]="'Remove ' + label"
        >
          <i
            class="fas fa-times"
            [class]="getCloseIconClasses()"
          ></i>
        </button>
      }
    </div>
  `
})
export class TagComponent {
  @Input() label = '';
  @Input() variant: TagVariant = 'solid';
  @Input() color: TagColor = 'default';
  @Input() size: TagSize = 'md';
  @Input() icon = '';
  @Input() showDot = false;
  @Input() closable = false;
  @Input() disabled = false;
  @Input() clickable = false;
  @Input() testId = '';

  @Output() close = new EventEmitter<void>();
  @Output() click = new EventEmitter<void>();

  getTagClasses(): string {
    const baseClasses = 'inline-flex items-center';
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    };

    const variantClasses = {
      solid: this.getSolidClasses(),
      outlined: this.getOutlinedClasses(),
      soft: this.getSoftClasses()
    };

    const stateClasses = this.getStateClasses();
    const roundedClasses = 'rounded-md';

    return `
      ${baseClasses}
      ${sizeClasses[this.size]}
      ${variantClasses[this.variant]}
      ${stateClasses}
      ${roundedClasses}
      transition-all duration-200
    `;
  }

  private getSolidClasses(): string {
    const colorClasses = {
      primary: 'bg-primary-600 text-white',
      secondary: 'bg-gray-600 text-white',
      success: 'bg-success-600 text-white',
      warning: 'bg-warning-600 text-white',
      error: 'bg-error-600 text-white',
      info: 'bg-info-600 text-white',
      default: 'bg-gray-100 text-gray-800'
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
      info: 'border border-info-600 text-info-600',
      default: 'border border-gray-300 text-gray-700'
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
      info: 'bg-info-50 text-info-700',
      default: 'bg-gray-50 text-gray-700'
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
    return `${this.size === 'sm' ? 'text-xs' : 'text-sm'} mr-1.5`;
  }

  getLabelClasses(): string {
    return 'font-medium';
  }

  getDotClasses(): string {
    const colorClasses = {
      primary: 'bg-primary-600',
      secondary: 'bg-gray-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      error: 'bg-error-600',
      info: 'bg-info-600',
      default: 'bg-gray-600'
    };

    return `${colorClasses[this.color]} mr-1.5`;
  }

  getCloseIconClasses(): string {
    return `
      ${this.size === 'sm' ? 'text-xs' : 'text-sm'}
      hover:opacity-75
      transition-opacity
    `;
  }

  onClose(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.close.emit();
    }
  }

  onClick(): void {
    if (!this.disabled && this.clickable) {
      this.click.emit();
    }
  }

  // Helper method to set variant
  setVariant(variant: TagVariant): void {
    this.variant = variant;
  }

  // Helper method to set color
  setColor(color: TagColor): void {
    this.color = color;
  }

  // Helper method to set size
  setSize(size: TagSize): void {
    this.size = size;
  }

  // Helper method to set label
  setLabel(label: string): void {
    this.label = label;
  }

  // Helper method to set icon
  setIcon(icon: string): void {
    this.icon = icon;
  }

  // Helper method to toggle dot
  toggleDot(show: boolean): void {
    this.showDot = show;
  }

  // Helper method to toggle closable
  toggleClosable(closable: boolean): void {
    this.closable = closable;
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
    return !!this.icon;
  }

  // Helper method to check if has dot
  hasDot(): boolean {
    return this.showDot;
  }

  // Helper method to get current state
  getState(): 'default' | 'disabled' | 'clickable' {
    if (this.disabled) return 'disabled';
    if (this.clickable) return 'clickable';
    return 'default';
  }
}