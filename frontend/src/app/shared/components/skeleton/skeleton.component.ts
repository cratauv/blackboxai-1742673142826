import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SkeletonType = 'text' | 'title' | 'avatar' | 'thumbnail' | 'button' | 'card';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-gray-200 rounded overflow-hidden"
      [class.animate-pulse]="animation === 'pulse'"
      [class.animate-wave]="animation === 'wave'"
      [ngClass]="[
        getTypeClasses(),
        roundedClasses[rounded],
        marginClasses[margin]
      ]"
      [style.width]="width"
      [style.height]="height"
    >
      @if (type === 'card') {
        <!-- Card Skeleton -->
        <div class="space-y-4">
          <!-- Image -->
          <div class="aspect-w-16 aspect-h-9 bg-gray-300 rounded"></div>
          
          <!-- Content -->
          <div class="p-4 space-y-4">
            <!-- Title -->
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            
            <!-- Description -->
            <div class="space-y-2">
              <div class="h-3 bg-gray-300 rounded"></div>
              <div class="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
            
            <!-- Footer -->
            <div class="flex justify-between items-center pt-2">
              <div class="h-4 bg-gray-300 rounded w-1/4"></div>
              <div class="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes wave {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: 200px 0;
      }
    }

    .animate-wave {
      background: linear-gradient(
        90deg,
        rgba(209, 213, 219, 0.4) 25%,
        rgba(209, 213, 219, 0.7) 37%,
        rgba(209, 213, 219, 0.4) 63%
      );
      background-size: 400px 100%;
      animation: wave 1.5s infinite linear;
    }
  `]
})
export class SkeletonComponent {
  @Input() type: SkeletonType = 'text';
  @Input() animation: SkeletonAnimation = 'pulse';
  @Input() width?: string;
  @Input() height?: string;
  @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' = 'md';
  @Input() margin: 'none' | 'sm' | 'md' | 'lg' = 'none';
  @Input() lines = 1;

  // Classes for different rounded variants
  readonly roundedClasses: Record<string, string> = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded',
    'lg': 'rounded-lg',
    'full': 'rounded-full'
  };

  // Classes for different margin variants
  readonly marginClasses: Record<string, string> = {
    'none': 'm-0',
    'sm': 'm-2',
    'md': 'm-4',
    'lg': 'm-6'
  };

  getTypeClasses(): string {
    const classes: Record<SkeletonType, string> = {
      'text': 'h-4 w-full',
      'title': 'h-6 w-3/4',
      'avatar': 'h-12 w-12 rounded-full',
      'thumbnail': 'h-32 w-full',
      'button': 'h-10 w-24',
      'card': 'w-full'
    };

    return classes[this.type];
  }

  // Helper method to generate multiple lines
  getLines(): number[] {
    return Array(this.lines).fill(0);
  }

  // Helper method to get random width for text lines
  getRandomWidth(): string {
    const widths = ['w-1/4', 'w-1/2', 'w-3/4', 'w-full'];
    return widths[Math.floor(Math.random() * widths.length)];
  }

  // Helper method to check if type is text-based
  isTextBased(): boolean {
    return ['text', 'title'].includes(this.type);
  }

  // Helper method to get aspect ratio class
  getAspectRatio(): string {
    switch (this.type) {
      case 'thumbnail':
        return 'aspect-w-16 aspect-h-9';
      case 'avatar':
        return 'aspect-w-1 aspect-h-1';
      default:
        return '';
    }
  }

  // Helper method to get container classes
  getContainerClasses(): string[] {
    const classes = ['bg-gray-200', 'overflow-hidden'];

    // Add animation class
    if (this.animation === 'pulse') {
      classes.push('animate-pulse');
    } else if (this.animation === 'wave') {
      classes.push('animate-wave');
    }

    // Add rounded class
    classes.push(this.roundedClasses[this.rounded]);

    // Add margin class
    classes.push(this.marginClasses[this.margin]);

    return classes;
  }
}