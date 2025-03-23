import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type DividerType = 'horizontal' | 'vertical';
type DividerVariant = 'solid' | 'dashed' | 'dotted';
type DividerAlignment = 'left' | 'center' | 'right';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="getContainerClasses()"
      role="separator"
      [attr.aria-orientation]="type"
    >
      @if (label || labelTemplate) {
        <div [class]="getLabelContainerClasses()">
          @if (labelTemplate) {
            <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
          } @else {
            <span [class]="getLabelClasses()">{{ label }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    :host-context(.dark) {
      --divider-color: rgba(255, 255, 255, 0.12);
      --text-color: rgba(255, 255, 255, 0.6);
    }
  `]
})
export class DividerComponent {
  @Input() type: DividerType = 'horizontal';
  @Input() variant: DividerVariant = 'solid';
  @Input() color = 'currentColor';
  @Input() thickness = '1px';
  @Input() spacing = '1rem';
  @Input() label = '';
  @Input() labelTemplate?: any;
  @Input() labelAlignment: DividerAlignment = 'center';
  @Input() className = '';

  getContainerClasses(): string {
    const baseClasses = 'relative';
    const typeClasses = this.type === 'vertical'
      ? 'border-l h-full'
      : 'border-t w-full';
    
    const variantClasses = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted'
    };

    return `
      ${baseClasses}
      ${typeClasses}
      ${variantClasses[this.variant]}
      border-gray-200 dark:border-gray-700
      ${this.className}
    `;
  }

  getLabelContainerClasses(): string {
    if (this.type === 'vertical') {
      return 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2';
    }

    const alignmentClasses = {
      left: 'left-4',
      center: 'left-1/2 -translate-x-1/2',
      right: 'right-4'
    };

    return `
      absolute
      ${alignmentClasses[this.labelAlignment]}
      top-1/2
      -translate-y-1/2
      px-2
      bg-white dark:bg-gray-900
    `;
  }

  getLabelClasses(): string {
    return `
      text-sm
      font-medium
      text-gray-500 dark:text-gray-400
      whitespace-nowrap
    `;
  }

  // Helper method to set type
  setType(type: DividerType): void {
    this.type = type;
  }

  // Helper method to set variant
  setVariant(variant: DividerVariant): void {
    this.variant = variant;
  }

  // Helper method to set color
  setColor(color: string): void {
    this.color = color;
  }

  // Helper method to set thickness
  setThickness(thickness: string): void {
    this.thickness = thickness;
  }

  // Helper method to set spacing
  setSpacing(spacing: string): void {
    this.spacing = spacing;
  }

  // Helper method to set label
  setLabel(label: string): void {
    this.label = label;
  }

  // Helper method to set label alignment
  setLabelAlignment(alignment: DividerAlignment): void {
    this.labelAlignment = alignment;
  }

  // Helper method to add class
  addClass(className: string): void {
    this.className = `${this.className} ${className}`.trim();
  }

  // Helper method to remove class
  removeClass(className: string): void {
    this.className = this.className
      .split(' ')
      .filter(c => c !== className)
      .join(' ');
  }

  // Helper method to check if has label
  hasLabel(): boolean {
    return !!(this.label || this.labelTemplate);
  }

  // Helper method to get computed style
  getComputedStyle(): { [key: string]: string } {
    return {
      '--divider-color': this.color,
      '--divider-thickness': this.thickness,
      '--divider-spacing': this.spacing
    };
  }

  // Helper method to create text divider
  static createTextDivider(text: string, alignment: DividerAlignment = 'center'): any {
    return {
      label: text,
      labelAlignment: alignment
    };
  }

  // Helper method to create vertical spacer
  static createVerticalSpacer(height: string = '1rem'): any {
    return {
      type: 'vertical' as DividerType,
      spacing: height
    };
  }

  // Helper method to create horizontal spacer
  static createHorizontalSpacer(width: string = '1rem'): any {
    return {
      type: 'horizontal' as DividerType,
      spacing: width
    };
  }

  // Helper method to create section divider
  static createSectionDivider(label?: string): any {
    return {
      variant: 'solid' as DividerVariant,
      thickness: '2px',
      spacing: '2rem',
      label
    };
  }
}