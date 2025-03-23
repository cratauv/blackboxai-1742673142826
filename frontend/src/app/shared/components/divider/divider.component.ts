import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type DividerType = 'solid' | 'dashed' | 'dotted';
type DividerOrientation = 'horizontal' | 'vertical';
type DividerAlignment = 'start' | 'center' | 'end';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center"
      [class]="getContainerClasses()"
      role="separator"
      [attr.aria-orientation]="orientation"
    >
      <!-- Line Before -->
      @if (label && alignment !== 'start') {
        <div
          class="flex-grow"
          [class]="getLineClasses()"
        ></div>
      }

      <!-- Label -->
      @if (label) {
        <div
          class="flex-shrink-0 font-medium text-gray-500"
          [class]="getLabelClasses()"
        >
          @if (icon) {
            <i [class]="icon" class="mr-2"></i>
          }
          {{ label }}
        </div>
      }

      <!-- Line After -->
      @if (label && alignment !== 'end') {
        <div
          class="flex-grow"
          [class]="getLineClasses()"
        ></div>
      }

      <!-- Simple Line (No Label) -->
      @if (!label) {
        <div
          class="flex-grow"
          [class]="getLineClasses()"
        ></div>
      }
    </div>
  `
})
export class DividerComponent {
  @Input() type: DividerType = 'solid';
  @Input() orientation: DividerOrientation = 'horizontal';
  @Input() alignment: DividerAlignment = 'center';
  @Input() label = '';
  @Input() icon = '';
  @Input() color = 'gray';
  @Input() spacing = '1rem';
  @Input() thickness = '1px';

  getContainerClasses(): string {
    if (this.orientation === 'vertical') {
      return `
        h-full flex-col
        ${this.label ? 'space-y-4' : ''}
      `.trim();
    }

    return '';
  }

  getLineClasses(): string {
    const borderStyles = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted'
    };

    const orientationClasses = this.orientation === 'vertical'
      ? 'border-l h-full'
      : 'border-t w-full';

    return `
      ${orientationClasses}
      ${borderStyles[this.type]}
      border-${this.color}-200
      ${this.label ? 'opacity-75' : ''}
    `.trim();
  }

  getLabelClasses(): string {
    if (this.orientation === 'vertical') {
      return `
        transform -rotate-90
        whitespace-nowrap
        px-4
      `.trim();
    }

    return `
      px-4
      ${this.alignment === 'start' ? 'pl-0' : ''}
      ${this.alignment === 'end' ? 'pr-0' : ''}
    `.trim();
  }

  // Helper method to set type
  setType(type: DividerType): void {
    this.type = type;
  }

  // Helper method to set orientation
  setOrientation(orientation: DividerOrientation): void {
    this.orientation = orientation;
  }

  // Helper method to set alignment
  setAlignment(alignment: DividerAlignment): void {
    this.alignment = alignment;
  }

  // Helper method to set label
  setLabel(label: string): void {
    this.label = label;
  }

  // Helper method to set icon
  setIcon(icon: string): void {
    this.icon = icon;
  }

  // Helper method to set color
  setColor(color: string): void {
    this.color = color;
  }

  // Helper method to set spacing
  setSpacing(spacing: string): void {
    this.spacing = spacing;
  }

  // Helper method to set thickness
  setThickness(thickness: string): void {
    this.thickness = thickness;
  }

  // Helper method to check if has label
  hasLabel(): boolean {
    return !!this.label;
  }

  // Helper method to check if has icon
  hasIcon(): boolean {
    return !!this.icon;
  }

  // Helper method to get border style
  getBorderStyle(): string {
    return `
      border-${this.type}
      border-${this.color}-200
      border-${this.orientation === 'vertical' ? 'l' : 't'}
      ${this.thickness}
    `.trim();
  }

  // Helper method to get label position classes
  getLabelPositionClasses(): string {
    if (this.orientation === 'vertical') {
      return 'transform -rotate-90 whitespace-nowrap px-4';
    }

    const alignmentClasses = {
      start: 'pl-0',
      center: 'px-4',
      end: 'pr-0'
    };

    return alignmentClasses[this.alignment];
  }

  // Helper method to get container style
  getContainerStyle(): { [key: string]: string } {
    return {
      gap: this.spacing,
      ...(this.orientation === 'vertical' ? { height: '100%' } : {})
    };
  }

  // Helper method to get line style
  getLineStyle(): { [key: string]: string } {
    return {
      borderWidth: this.thickness,
      ...(this.orientation === 'vertical' ? { height: '100%' } : { width: '100%' })
    };
  }

  // Helper method to get accessibility attributes
  getAriaAttributes(): { [key: string]: string } {
    return {
      role: 'separator',
      'aria-orientation': this.orientation
    };
  }

  // Helper method to check if is vertical
  isVertical(): boolean {
    return this.orientation === 'vertical';
  }

  // Helper method to check if is horizontal
  isHorizontal(): boolean {
    return this.orientation === 'horizontal';
  }
}