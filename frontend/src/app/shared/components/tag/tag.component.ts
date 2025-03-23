import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type TagType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
type TagSize = 'sm' | 'md' | 'lg';
type TagVariant = 'solid' | 'soft' | 'outline';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="inline-flex items-center justify-center"
      [class]="getTagClasses()"
      [class.cursor-pointer]="clickable"
      [class.opacity-50]="disabled"
      (click)="onClick($event)"
    >
      <!-- Leading Icon -->
      @if (icon) {
        <i
          [class]="icon"
          [class.mr-1.5]="!!label"
          [class]="getIconClasses()"
        ></i>
      }

      <!-- Label -->
      @if (label) {
        <span class="truncate">{{ label }}</span>
      }

      <!-- Remove Button -->
      @if (removable && !disabled) {
        <button
          type="button"
          class="ml-1.5 focus:outline-none"
          [class]="getRemoveButtonClasses()"
          (click)="onRemove($event)"
          aria-label="Remove"
        >
          <i class="fas fa-times"></i>
        </button>
      }
    </div>
  `
})
export class TagComponent {
  @Input() type: TagType = 'primary';
  @Input() size: TagSize = 'md';
  @Input() variant: TagVariant = 'solid';
  @Input() label = '';
  @Input() icon = '';
  @Input() removable = false;
  @Input() clickable = false;
  @Input() disabled = false;
  @Input() selected = false;

  @Output() remove = new EventEmitter<void>();
  @Output() click = new EventEmitter<void>();

  private readonly sizeMap = {
    sm: {
      base: 'px-2 py-0.5 text-xs',
      icon: 'text-xs'
    },
    md: {
      base: 'px-2.5 py-1 text-sm',
      icon: 'text-sm'
    },
    lg: {
      base: 'px-3 py-1.5 text-base',
      icon: 'text-base'
    }
  };

  private readonly colorMap = {
    solid: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600',
      secondary: 'bg-gray-500 text-white hover:bg-gray-600',
      success: 'bg-green-500 text-white hover:bg-green-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      info: 'bg-blue-500 text-white hover:bg-blue-600'
    },
    soft: {
      primary: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
      secondary: 'bg-gray-50 text-gray-700 hover:bg-gray-100',
      success: 'bg-green-50 text-green-700 hover:bg-green-100',
      danger: 'bg-red-50 text-red-700 hover:bg-red-100',
      warning: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      info: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    },
    outline: {
      primary: 'border border-primary-500 text-primary-500 hover:bg-primary-50',
      secondary: 'border border-gray-500 text-gray-500 hover:bg-gray-50',
      success: 'border border-green-500 text-green-500 hover:bg-green-50',
      danger: 'border border-red-500 text-red-500 hover:bg-red-50',
      warning: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-50',
      info: 'border border-blue-500 text-blue-500 hover:bg-blue-50'
    }
  };

  getTagClasses(): string {
    return `
      ${this.sizeMap[this.size].base}
      ${this.colorMap[this.variant][this.type]}
      rounded-md
      font-medium
      transition-colors
      ${this.selected ? 'ring-2 ring-offset-2' : ''}
      ${this.clickable && !this.disabled ? 'cursor-pointer' : ''}
    `.trim();
  }

  getIconClasses(): string {
    return this.sizeMap[this.size].icon;
  }

  getRemoveButtonClasses(): string {
    const hoverColors = {
      solid: {
        primary: 'hover:text-primary-200',
        secondary: 'hover:text-gray-200',
        success: 'hover:text-green-200',
        danger: 'hover:text-red-200',
        warning: 'hover:text-yellow-200',
        info: 'hover:text-blue-200'
      },
      soft: {
        primary: 'hover:text-primary-800',
        secondary: 'hover:text-gray-800',
        success: 'hover:text-green-800',
        danger: 'hover:text-red-800',
        warning: 'hover:text-yellow-800',
        info: 'hover:text-blue-800'
      },
      outline: {
        primary: 'hover:text-primary-700',
        secondary: 'hover:text-gray-700',
        success: 'hover:text-green-700',
        danger: 'hover:text-red-700',
        warning: 'hover:text-yellow-700',
        info: 'hover:text-blue-700'
      }
    };

    return `
      ${this.sizeMap[this.size].icon}
      ${hoverColors[this.variant][this.type]}
    `;
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

  // Helper method to set type
  setType(type: TagType): void {
    this.type = type;
  }

  // Helper method to set size
  setSize(size: TagSize): void {
    this.size = size;
  }

  // Helper method to set variant
  setVariant(variant: TagVariant): void {
    this.variant = variant;
  }

  // Helper method to set label
  setLabel(label: string): void {
    this.label = label;
  }

  // Helper method to set icon
  setIcon(icon: string): void {
    this.icon = icon;
  }

  // Helper method to toggle selected state
  toggleSelected(): void {
    if (!this.disabled) {
      this.selected = !this.selected;
    }
  }

  // Helper method to toggle disabled state
  toggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  // Helper method to toggle removable
  toggleRemovable(): void {
    this.removable = !this.removable;
  }

  // Helper method to toggle clickable
  toggleClickable(): void {
    this.clickable = !this.clickable;
  }

  // Helper method to get color scheme
  getColorScheme(): { background: string; text: string; border?: string } {
    const classes = this.colorMap[this.variant][this.type].split(' ');
    return {
      background: classes.find(c => c.startsWith('bg-')) || '',
      text: classes.find(c => c.startsWith('text-')) || '',
      border: classes.find(c => c.startsWith('border-'))
    };
  }

  // Helper method to check if has icon
  hasIcon(): boolean {
    return !!this.icon;
  }

  // Helper method to check if has label
  hasLabel(): boolean {
    return !!this.label;
  }

  // Helper method to get dimensions
  getDimensions(): { height: string; minWidth: string } {
    const sizes = {
      sm: { height: '1.5rem', minWidth: '1.5rem' },
      md: { height: '2rem', minWidth: '2rem' },
      lg: { height: '2.5rem', minWidth: '2.5rem' }
    };
    return sizes[this.size];
  }
}