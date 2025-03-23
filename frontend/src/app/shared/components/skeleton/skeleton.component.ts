import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SkeletonType = 'text' | 'circle' | 'rect' | 'avatar' | 'button' | 'card';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-gray-200 dark:bg-gray-700"
      [class]="getSkeletonClasses()"
      [style.width]="width"
      [style.height]="height"
      [style.borderRadius]="getBorderRadius()"
      aria-hidden="true"
    >
      @if (type === 'avatar' && showInitials) {
        <div class="w-full h-full flex items-center justify-center text-gray-300">
          <i class="fas fa-user"></i>
        </div>
      }

      @if (type === 'card') {
        <div class="h-full">
          <!-- Card Image -->
          <div class="h-48 bg-gray-300 dark:bg-gray-600"></div>

          <!-- Card Content -->
          <div class="p-4 space-y-3">
            <!-- Title -->
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>

            <!-- Description -->
            <div class="space-y-2">
              <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center pt-2">
              <div class="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div class="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes wave {
      0% { transform: translateX(-100%); }
      50%, 100% { transform: translateX(100%); }
    }

    .skeleton-wave {
      position: relative;
      overflow: hidden;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.08),
          transparent
        );
        animation: wave 1.5s infinite;
      }
    }

    .dark .skeleton-wave::after {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.04),
        transparent
      );
    }
  `]
})
export class SkeletonComponent {
  @Input() type: SkeletonType = 'text';
  @Input() animation: SkeletonAnimation = 'pulse';
  @Input() width?: string;
  @Input() height?: string;
  @Input() rounded = false;
  @Input() showInitials = true;
  @Input() lines = 1;
  @Input() spacing = '0.5rem';

  getSkeletonClasses(): string {
    const baseClasses = ['relative'];

    // Animation classes
    if (this.animation === 'pulse') {
      baseClasses.push('animate-pulse');
    } else if (this.animation === 'wave') {
      baseClasses.push('skeleton-wave');
    }

    // Type-specific classes
    switch (this.type) {
      case 'text':
        if (!this.height) baseClasses.push('h-4');
        if (!this.width) baseClasses.push('w-full');
        baseClasses.push('rounded');
        break;

      case 'circle':
        if (!this.height) baseClasses.push('h-12');
        if (!this.width) baseClasses.push('w-12');
        baseClasses.push('rounded-full');
        break;

      case 'avatar':
        if (!this.height) baseClasses.push('h-10');
        if (!this.width) baseClasses.push('w-10');
        baseClasses.push('rounded-full');
        break;

      case 'button':
        if (!this.height) baseClasses.push('h-10');
        if (!this.width) baseClasses.push('w-24');
        baseClasses.push('rounded-md');
        break;

      case 'card':
        if (!this.height) baseClasses.push('h-96');
        if (!this.width) baseClasses.push('w-72');
        baseClasses.push('rounded-lg overflow-hidden');
        break;

      default:
        if (!this.height) baseClasses.push('h-4');
        if (!this.width) baseClasses.push('w-full');
        break;
    }

    return baseClasses.join(' ');
  }

  getBorderRadius(): string {
    if (this.type === 'circle' || this.type === 'avatar') {
      return '50%';
    }
    if (this.rounded) {
      return '0.375rem';
    }
    return this.type === 'text' ? '0.25rem' : '0';
  }

  // Helper method to set type
  setType(type: SkeletonType): void {
    this.type = type;
  }

  // Helper method to set animation
  setAnimation(animation: SkeletonAnimation): void {
    this.animation = animation;
  }

  // Helper method to set dimensions
  setDimensions(width?: string, height?: string): void {
    this.width = width;
    this.height = height;
  }

  // Helper method to toggle rounded
  toggleRounded(): void {
    this.rounded = !this.rounded;
  }

  // Helper method to get dimensions
  getDimensions(): { width: string; height: string } {
    return {
      width: this.width || this.getDefaultWidth(),
      height: this.height || this.getDefaultHeight()
    };
  }

  // Helper method to get default width
  private getDefaultWidth(): string {
    switch (this.type) {
      case 'circle':
      case 'avatar':
        return '2.5rem';
      case 'button':
        return '6rem';
      case 'card':
        return '18rem';
      default:
        return '100%';
    }
  }

  // Helper method to get default height
  private getDefaultHeight(): string {
    switch (this.type) {
      case 'circle':
      case 'avatar':
        return '2.5rem';
      case 'button':
        return '2.5rem';
      case 'card':
        return '24rem';
      default:
        return '1rem';
    }
  }

  // Helper method to create text lines
  getTextLines(): number[] {
    return Array(this.lines).fill(0);
  }

  // Helper method to get line width
  getLineWidth(index: number): string {
    if (index === this.lines - 1) {
      return '75%';
    }
    return '100%';
  }

  // Helper method to get animation duration
  getAnimationDuration(): number {
    switch (this.animation) {
      case 'pulse':
        return 1500;
      case 'wave':
        return 1500;
      default:
        return 0;
    }
  }

  // Helper method to check if animated
  isAnimated(): boolean {
    return this.animation !== 'none';
  }

  // Helper method to get theme classes
  getThemeClasses(): string {
    return 'bg-gray-200 dark:bg-gray-700';
  }

  // Helper method to create paragraph skeleton
  static createParagraph(lines: number = 3): any[] {
    return Array(lines).fill(0).map((_, i) => ({
      type: 'text' as SkeletonType,
      width: i === lines - 1 ? '75%' : '100%'
    }));
  }

  // Helper method to create card skeleton
  static createCard(): any {
    return {
      type: 'card' as SkeletonType,
      width: '18rem',
      height: '24rem'
    };
  }
}