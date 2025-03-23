import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="getContainerClasses()"
      [style.width]="width"
      [style.height]="height"
      [style.borderRadius]="getBorderRadius()"
    >
      @if (animation === 'wave') {
        <div class="skeleton-wave absolute inset-0"></div>
      }
    </div>
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }

    @keyframes wave {
      0% {
        transform: translateX(-100%);
      }
      50%, 100% {
        transform: translateX(100%);
      }
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-wave {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      animation: wave 1.5s linear infinite;
    }

    .dark .skeleton-wave {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(0, 0, 0, 0.1),
        transparent
      );
    }
  `]
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'text';
  @Input() animation: SkeletonAnimation = 'pulse';
  @Input() width: string = '100%';
  @Input() height: string = '1rem';
  @Input() lines = 1;
  @Input() spacing = '0.5rem';
  @Input() className = '';

  getContainerClasses(): string {
    const baseClasses = 'relative overflow-hidden bg-gray-200 dark:bg-gray-700';
    const animationClasses = this.getAnimationClasses();

    return `
      ${baseClasses}
      ${animationClasses}
      ${this.className}
    `;
  }

  getAnimationClasses(): string {
    switch (this.animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'relative overflow-hidden';
      default:
        return '';
    }
  }

  getBorderRadius(): string {
    switch (this.variant) {
      case 'circular':
        return '50%';
      case 'rounded':
        return '0.5rem';
      case 'rectangular':
        return '0';
      case 'text':
        return '0.25rem';
      default:
        return '0';
    }
  }

  // Helper method to set variant
  setVariant(variant: SkeletonVariant): void {
    this.variant = variant;
  }

  // Helper method to set animation
  setAnimation(animation: SkeletonAnimation): void {
    this.animation = animation;
  }

  // Helper method to set dimensions
  setDimensions(width: string, height: string): void {
    this.width = width;
    this.height = height;
  }

  // Helper method to set lines
  setLines(lines: number): void {
    this.lines = lines;
  }

  // Helper method to set spacing
  setSpacing(spacing: string): void {
    this.spacing = spacing;
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

  // Helper method to toggle animation
  toggleAnimation(enable: boolean): void {
    this.animation = enable ? 'pulse' : 'none';
  }

  // Helper method to get computed height
  getComputedHeight(): string {
    if (this.lines > 1) {
      const lineHeight = parseFloat(this.height);
      const spacingValue = parseFloat(this.spacing);
      const totalSpacing = (this.lines - 1) * spacingValue;
      return `calc(${this.lines} * ${this.height} + ${totalSpacing}px)`;
    }
    return this.height;
  }

  // Helper method to check if animated
  isAnimated(): boolean {
    return this.animation !== 'none';
  }

  // Helper method to get animation duration
  getAnimationDuration(): string {
    switch (this.animation) {
      case 'pulse':
        return '2s';
      case 'wave':
        return '1.5s';
      default:
        return '0s';
    }
  }

  // Helper method to get animation timing
  getAnimationTiming(): string {
    switch (this.animation) {
      case 'pulse':
        return 'cubic-bezier(0.4, 0, 0.6, 1)';
      case 'wave':
        return 'linear';
      default:
        return 'linear';
    }
  }

  // Helper method to create text skeleton
  static createText(lines: number = 1, width: string = '100%'): any {
    return {
      variant: 'text' as SkeletonVariant,
      lines,
      width
    };
  }

  // Helper method to create avatar skeleton
  static createAvatar(size: string = '40px'): any {
    return {
      variant: 'circular' as SkeletonVariant,
      width: size,
      height: size
    };
  }

  // Helper method to create image skeleton
  static createImage(width: string, height: string): any {
    return {
      variant: 'rectangular' as SkeletonVariant,
      width,
      height
    };
  }

  // Helper method to create button skeleton
  static createButton(width: string = '100px', height: string = '36px'): any {
    return {
      variant: 'rounded' as SkeletonVariant,
      width,
      height
    };
  }
}