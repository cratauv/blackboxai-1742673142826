import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type DividerVariant = 'solid' | 'dashed' | 'dotted';
type DividerAlignment = 'start' | 'center' | 'end';
type DividerOrientation = 'horizontal' | 'vertical';
type DividerThickness = 'thin' | 'medium' | 'thick';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="flex"
      [class.items-center]="orientation === 'horizontal'"
      [class.h-full]="orientation === 'vertical'"
    >
      <!-- Left/Top Content -->
      @if (showContent && ((orientation === 'horizontal' && alignment !== 'end') || 
          (orientation === 'vertical' && alignment !== 'end'))) {
        <div [class]="getContentClasses('before')">
          <ng-content select="[dividerContent]"></ng-content>
        </div>
      }

      <!-- Divider Line -->
      <div
        role="separator"
        [attr.aria-orientation]="orientation"
        [class]="getDividerClasses()"
      >
        <!-- Center Content -->
        @if (showContent && alignment === 'center') {
          <div [class]="getContentClasses('center')">
            <ng-content select="[dividerContent]"></ng-content>
          </div>
        }
      </div>

      <!-- Right/Bottom Content -->
      @if (showContent && ((orientation === 'horizontal' && alignment !== 'start') || 
          (orientation === 'vertical' && alignment !== 'start'))) {
        <div [class]="getContentClasses('after')">
          <ng-content select="[dividerContent]"></ng-content>
        </div>
      }
    </div>
  `
})
export class DividerComponent {
  @Input() variant: DividerVariant = 'solid';
  @Input() orientation: DividerOrientation = 'horizontal';
  @Input() alignment: DividerAlignment = 'center';
  @Input() thickness: DividerThickness = 'thin';
  @Input() color = 'gray-200';
  @Input() spacing = 4;
  @Input() showContent = false;

  getDividerClasses(): string {
    const baseClasses = [
      this.getBorderStyle(),
      this.getThicknessClasses(),
      this.getColorClasses(),
      'flex-shrink-0'
    ];

    if (this.orientation === 'horizontal') {
      baseClasses.push('w-full');
    } else {
      baseClasses.push('h-full');
    }

    if (this.showContent && this.alignment === 'center') {
      baseClasses.push('flex items-center justify-center');
    }

    return baseClasses.join(' ');
  }

  getContentClasses(position: 'before' | 'center' | 'after'): string {
    const baseClasses = ['flex-shrink-0'];

    if (this.orientation === 'horizontal') {
      switch (position) {
        case 'before':
          baseClasses.push(`mr-${this.spacing}`);
          break;
        case 'center':
          baseClasses.push(`mx-${this.spacing}`);
          break;
        case 'after':
          baseClasses.push(`ml-${this.spacing}`);
          break;
      }
    } else {
      switch (position) {
        case 'before':
          baseClasses.push(`mb-${this.spacing}`);
          break;
        case 'center':
          baseClasses.push(`my-${this.spacing}`);
          break;
        case 'after':
          baseClasses.push(`mt-${this.spacing}`);
          break;
      }
    }

    return baseClasses.join(' ');
  }

  private getBorderStyle(): string {
    const styles = {
      solid: this.orientation === 'horizontal' ? 'border-t' : 'border-l',
      dashed: this.orientation === 'horizontal' ? 'border-t border-dashed' : 'border-l border-dashed',
      dotted: this.orientation === 'horizontal' ? 'border-t border-dotted' : 'border-l border-dotted'
    };
    return styles[this.variant];
  }

  private getThicknessClasses(): string {
    const thicknesses = {
      thin: '',
      medium: this.orientation === 'horizontal' ? 'border-t-2' : 'border-l-2',
      thick: this.orientation === 'horizontal' ? 'border-t-4' : 'border-l-4'
    };
    return thicknesses[this.thickness];
  }

  private getColorClasses(): string {
    return `border-${this.color}`;
  }

  // Helper method to get margin classes
  getMarginClasses(): string {
    if (this.orientation === 'horizontal') {
      return `my-${this.spacing}`;
    }
    return `mx-${this.spacing}`;
  }

  // Helper method to get padding classes
  getPaddingClasses(): string {
    if (this.orientation === 'horizontal') {
      return `py-${this.spacing}`;
    }
    return `px-${this.spacing}`;
  }

  // Helper method to get flex direction
  getFlexDirection(): string {
    if (this.orientation === 'horizontal') {
      return 'flex-row';
    }
    return 'flex-col';
  }

  // Helper method to get alignment classes
  getAlignmentClasses(): string {
    const alignments = {
      start: this.orientation === 'horizontal' ? 'justify-start' : 'items-start',
      center: this.orientation === 'horizontal' ? 'justify-center' : 'items-center',
      end: this.orientation === 'horizontal' ? 'justify-end' : 'items-end'
    };
    return alignments[this.alignment];
  }

  // Helper method to check if divider is horizontal
  isHorizontal(): boolean {
    return this.orientation === 'horizontal';
  }

  // Helper method to check if divider is vertical
  isVertical(): boolean {
    return this.orientation === 'vertical';
  }

  // Helper method to get ARIA label
  getAriaLabel(): string {
    return `${this.orientation} divider`;
  }

  // Helper method to get container height for vertical divider
  getContainerHeight(): string {
    return this.isVertical() ? 'h-full' : '';
  }

  // Helper method to get container width for horizontal divider
  getContainerWidth(): string {
    return this.isHorizontal() ? 'w-full' : '';
  }
}