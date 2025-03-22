import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type TagVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type TagSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="inline-flex items-center"
      [class]="getTagClasses()"
      [class.cursor-pointer]="clickable"
      [class.hover:shadow-sm]="clickable"
      (click)="onClick()"
    >
      <!-- Leading Icon -->
      @if (icon) {
        <i 
          [class]="icon"
          class="mr-1.5"
          [class.text-xs]="size === 'sm'"
          [class.text-sm]="size === 'md'"
          [class.text-base]="size === 'lg'"
        ></i>
      }

      <!-- Label -->
      <span class="truncate">{{ label }}</span>

      <!-- Counter -->
      @if (count !== undefined) {
        <span 
          class="ml-1.5 rounded-full bg-white bg-opacity-20 px-1.5"
          [class.text-xs]="size === 'sm'"
          [class.text-sm]="size === 'md'"
          [class.text-base]="size === 'lg'"
        >
          {{ count }}
        </span>
      }

      <!-- Remove Button -->
      @if (removable) {
        <button
          type="button"
          class="ml-1.5 hover:text-opacity-75 focus:outline-none"
          [class.text-xs]="size === 'sm'"
          [class.text-sm]="size === 'md'"
          [class.text-base]="size === 'lg'"
          (click)="onRemove($event)"
          [attr.aria-label]="'Remove ' + label"
        >
          <i class="fas fa-times"></i>
        </button>
      }
    </div>
  `
})
export class TagComponent {
  @Input() label = '';
  @Input() variant: TagVariant = 'primary';
  @Input() size: TagSize = 'md';
  @Input() icon = '';
  @Input() count?: number;
  @Input() removable = false;
  @Input() clickable = false;
  @Input() outlined = false;

  @Output() remove = new EventEmitter<void>();
  @Output() click = new EventEmitter<void>();

  getTagClasses(): string {
    const baseClasses = 'rounded-full transition-all duration-200';
    const sizeClasses = this.getSizeClasses();
    const variantClasses = this.getVariantClasses();
    const outlineClasses = this.outlined ? this.getOutlineClasses() : '';
    
    return `${baseClasses} ${sizeClasses} ${variantClasses} ${outlineClasses}`.trim();
  }

  private getSizeClasses(): string {
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    };
    return sizes[this.size];
  }

  private getVariantClasses(): string {
    if (this.outlined) return '';

    const variants = {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    };
    return variants[this.variant];
  }

  private getOutlineClasses(): string {
    const variants = {
      primary: 'border border-primary-500 text-primary-700',
      secondary: 'border border-gray-500 text-gray-700',
      success: 'border border-green-500 text-green-700',
      warning: 'border border-yellow-500 text-yellow-700',
      danger: 'border border-red-500 text-red-700',
      info: 'border border-blue-500 text-blue-700'
    };
    return variants[this.variant];
  }

  onClick(): void {
    if (this.clickable) {
      this.click.emit();
    }
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit();
  }

  // Helper method to get background color
  getBgColor(): string {
    const colors = {
      primary: '#EBF5FF',
      secondary: '#F3F4F6',
      success: '#DEF7EC',
      warning: '#FEF3C7',
      danger: '#FEE2E2',
      info: '#DBEAFE'
    };
    return colors[this.variant];
  }

  // Helper method to get text color
  getTextColor(): string {
    const colors = {
      primary: '#1E40AF',
      secondary: '#1F2937',
      success: '#065F46',
      warning: '#92400E',
      danger: '#991B1B',
      info: '#1E40AF'
    };
    return colors[this.variant];
  }

  // Helper method to get border color
  getBorderColor(): string {
    const colors = {
      primary: '#3B82F6',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6'
    };
    return colors[this.variant];
  }

  // Helper method to get hover background color
  getHoverBgColor(): string {
    const colors = {
      primary: '#DBEAFE',
      secondary: '#E5E7EB',
      success: '#D1FAE5',
      warning: '#FEF3C7',
      danger: '#FEE2E2',
      info: '#DBEAFE'
    };
    return colors[this.variant];
  }

  // Helper method to format count
  formatCount(): string {
    if (this.count === undefined) return '';
    if (this.count > 999) {
      return `${Math.floor(this.count / 1000)}k+`;
    }
    return this.count.toString();
  }

  // Helper method to get icon color
  getIconColor(): string {
    if (this.outlined) {
      return this.getTextColor();
    }
    return this.getTextColor();
  }

  // Helper method to check if tag is active
  isActive(): boolean {
    return this.clickable && this.variant !== 'secondary';
  }

  // Helper method to get ARIA attributes
  getAriaAttributes(): { [key: string]: string } {
    const attrs: { [key: string]: string } = {
      role: this.clickable ? 'button' : 'status'
    };

    if (this.clickable) {
      attrs['aria-pressed'] = 'false';
    }

    if (this.removable) {
      attrs['aria-removable'] = 'true';
    }

    return attrs;
  }
}