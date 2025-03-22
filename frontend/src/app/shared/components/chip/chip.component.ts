import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ChipVariant = 'solid' | 'outlined' | 'soft';
type ChipSize = 'sm' | 'md' | 'lg';
type ChipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="inline-flex items-center"
      [class.cursor-pointer]="clickable"
      [class.opacity-50]="disabled"
      (click)="onClick($event)"
    >
      <!-- Chip Container -->
      <div
        class="inline-flex items-center rounded-full"
        [class]="getChipClasses()"
      >
        <!-- Leading Icon -->
        @if (leadingIcon) {
          <i 
            [class]="leadingIcon"
            [class]="getIconClasses('leading')"
          ></i>
        }

        <!-- Avatar -->
        @if (avatar) {
          <img
            [src]="avatar"
            [alt]="label"
            class="rounded-full object-cover"
            [class]="getAvatarClasses()"
          />
        }

        <!-- Label -->
        <span [class]="getLabelClasses()">
          {{ label }}
        </span>

        <!-- Counter -->
        @if (counter !== undefined) {
          <span 
            class="ml-1 rounded-full bg-white bg-opacity-20"
            [class]="getCounterClasses()"
          >
            {{ counter }}
          </span>
        }

        <!-- Trailing Icon -->
        @if (trailingIcon) {
          <i 
            [class]="trailingIcon"
            [class]="getIconClasses('trailing')"
          ></i>
        }

        <!-- Remove Button -->
        @if (removable && !disabled) {
          <button
            type="button"
            class="focus:outline-none"
            [class]="getRemoveButtonClasses()"
            (click)="onRemove($event)"
            [attr.aria-label]="'Remove ' + label"
          >
            <i class="fas fa-times"></i>
          </button>
        }
      </div>
    </div>
  `
})
export class ChipComponent {
  @Input() label = '';
  @Input() variant: ChipVariant = 'solid';
  @Input() color: ChipColor = 'primary';
  @Input() size: ChipSize = 'md';
  @Input() leadingIcon = '';
  @Input() trailingIcon = '';
  @Input() avatar = '';
  @Input() counter?: number;
  @Input() removable = false;
  @Input() clickable = false;
  @Input() disabled = false;
  @Input() selected = false;

  @Output() remove = new EventEmitter<void>();
  @Output() click = new EventEmitter<void>();

  getChipClasses(): string {
    const baseClasses = 'transition-colors duration-200';
    const sizeClasses = this.getSizeClasses();
    const variantClasses = this.getVariantClasses();
    const stateClasses = this.getStateClasses();
    
    return `${baseClasses} ${sizeClasses} ${variantClasses} ${stateClasses}`;
  }

  private getSizeClasses(): string {
    return {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    }[this.size];
  }

  private getVariantClasses(): string {
    if (this.variant === 'outlined') {
      return {
        primary: 'border border-primary-500 text-primary-700',
        secondary: 'border border-gray-500 text-gray-700',
        success: 'border border-green-500 text-green-700',
        warning: 'border border-yellow-500 text-yellow-700',
        danger: 'border border-red-500 text-red-700',
        info: 'border border-blue-500 text-blue-700'
      }[this.color];
    }

    if (this.variant === 'soft') {
      return {
        primary: 'bg-primary-50 text-primary-700',
        secondary: 'bg-gray-50 text-gray-700',
        success: 'bg-green-50 text-green-700',
        warning: 'bg-yellow-50 text-yellow-700',
        danger: 'bg-red-50 text-red-700',
        info: 'bg-blue-50 text-blue-700'
      }[this.color];
    }

    return {
      primary: 'bg-primary-500 text-white',
      secondary: 'bg-gray-500 text-white',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-white',
      danger: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white'
    }[this.color];
  }

  private getStateClasses(): string {
    if (this.disabled) return '';

    const hoverClasses = this.clickable ? {
      solid: {
        primary: 'hover:bg-primary-600',
        secondary: 'hover:bg-gray-600',
        success: 'hover:bg-green-600',
        warning: 'hover:bg-yellow-600',
        danger: 'hover:bg-red-600',
        info: 'hover:bg-blue-600'
      }[this.color],
      outlined: {
        primary: 'hover:bg-primary-50',
        secondary: 'hover:bg-gray-50',
        success: 'hover:bg-green-50',
        warning: 'hover:bg-yellow-50',
        danger: 'hover:bg-red-50',
        info: 'hover:bg-blue-50'
      }[this.color],
      soft: {
        primary: 'hover:bg-primary-100',
        secondary: 'hover:bg-gray-100',
        success: 'hover:bg-green-100',
        warning: 'hover:bg-yellow-100',
        danger: 'hover:bg-red-100',
        info: 'hover:bg-blue-100'
      }[this.color]
    }[this.variant] : '';

    return hoverClasses;
  }

  getIconClasses(position: 'leading' | 'trailing'): string {
    const marginClass = position === 'leading' ? 'mr-1.5' : 'ml-1.5';
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }[this.size];
    
    return `${marginClass} ${sizeClasses}`;
  }

  getAvatarClasses(): string {
    return {
      sm: '-ml-0.5 mr-1 h-4 w-4',
      md: '-ml-1 mr-1.5 h-5 w-5',
      lg: '-ml-1 mr-2 h-6 w-6'
    }[this.size];
  }

  getLabelClasses(): string {
    return 'font-medium';
  }

  getCounterClasses(): string {
    return {
      sm: 'px-1 text-xs',
      md: 'px-1.5 text-xs',
      lg: 'px-2 text-sm'
    }[this.size];
  }

  getRemoveButtonClasses(): string {
    const baseClasses = '-mr-1 ml-1.5 hover:text-opacity-75';
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }[this.size];
    
    return `${baseClasses} ${sizeClasses}`;
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && this.clickable) {
      this.click.emit();
    }
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.remove.emit();
    }
  }

  // Helper method to get background color
  getBgColor(): string {
    if (this.variant === 'outlined') return 'transparent';
    
    const colors = {
      primary: this.variant === 'soft' ? '#EBF5FF' : '#3B82F6',
      secondary: this.variant === 'soft' ? '#F3F4F6' : '#6B7280',
      success: this.variant === 'soft' ? '#ECFDF5' : '#10B981',
      warning: this.variant === 'soft' ? '#FFFBEB' : '#F59E0B',
      danger: this.variant === 'soft' ? '#FEF2F2' : '#EF4444',
      info: this.variant === 'soft' ? '#EFF6FF' : '#3B82F6'
    };
    return colors[this.color];
  }

  // Helper method to get text color
  getTextColor(): string {
    if (this.variant === 'solid') return '#FFFFFF';
    
    const colors = {
      primary: '#2563EB',
      secondary: '#4B5563',
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#2563EB'
    };
    return colors[this.color];
  }

  // Helper method to get border color
  getBorderColor(): string {
    if (this.variant !== 'outlined') return 'transparent';
    
    const colors = {
      primary: '#3B82F6',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6'
    };
    return colors[this.color];
  }
}