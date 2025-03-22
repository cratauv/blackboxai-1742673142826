import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
        [class.animate-fade-in]="isOpen"
        (click)="onBackdropClick()"
      ></div>

      <!-- Drawer Panel -->
      <div
        class="fixed z-50 overflow-hidden"
        [class]="getPositionClasses()"
        role="dialog"
        aria-modal="true"
        [@drawerAnimation]="position"
      >
        <div 
          class="h-full bg-white shadow-xl flex flex-col"
          [class]="getSizeClasses()"
        >
          <!-- Header -->
          @if (showHeader) {
            <div class="px-4 py-3 border-b flex items-center justify-between">
              <div class="flex items-center">
                @if (icon) {
                  <i [class]="icon" class="mr-2 text-gray-500"></i>
                }
                <h2 class="text-lg font-medium text-gray-900">{{ title }}</h2>
              </div>
              
              @if (showCloseButton) {
                <button
                  type="button"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  (click)="close()"
                >
                  <span class="sr-only">Close panel</span>
                  <i class="fas fa-times text-xl"></i>
                </button>
              }
            </div>
          }

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <div [class]="getContentClasses()">
              <ng-content></ng-content>
            </div>
          </div>

          <!-- Footer -->
          @if (showFooter) {
            <div class="border-t px-4 py-3 bg-gray-50">
              <ng-content select="[drawerFooter]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  animations: [
    trigger('drawerAnimation', [
      transition('void => left', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('left => void', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
      ]),
      transition('void => right', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('right => void', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
      ]),
      transition('void => top', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition('top => void', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
      ]),
      transition('void => bottom', [
        style({ transform: 'translateY(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition('bottom => void', [
        animate('200ms ease-in', style({ transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class DrawerComponent {
  @Input() isOpen = false;
  @Input() position: DrawerPosition = 'right';
  @Input() size: DrawerSize = 'md';
  @Input() title = '';
  @Input() icon = '';
  @Input() showHeader = true;
  @Input() showFooter = false;
  @Input() showCloseButton = true;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;

  @Output() closed = new EventEmitter<void>();

  getPositionClasses(): string {
    const positions = {
      left: 'inset-y-0 left-0',
      right: 'inset-y-0 right-0',
      top: 'inset-x-0 top-0',
      bottom: 'inset-x-0 bottom-0'
    };
    return positions[this.position];
  }

  getSizeClasses(): string {
    if (this.position === 'top' || this.position === 'bottom') {
      const heights = {
        sm: 'h-1/4',
        md: 'h-1/2',
        lg: 'h-3/4',
        full: 'h-screen'
      };
      return heights[this.size];
    }

    const widths = {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      full: 'w-screen'
    };
    return widths[this.size];
  }

  getContentClasses(): string {
    return this.showHeader || this.showFooter ? 'p-4' : 'p-6';
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  // Helper method to get animation duration
  getAnimationDuration(): number {
    return 300; // milliseconds
  }

  // Helper method to get animation timing
  getAnimationTiming(): string {
    return 'ease-out';
  }

  // Helper method to get drawer dimensions
  getDimensions(): { width?: string; height?: string } {
    const sizes = {
      sm: { width: '16rem', height: '25vh' },
      md: { width: '20rem', height: '50vh' },
      lg: { width: '24rem', height: '75vh' },
      full: { width: '100vw', height: '100vh' }
    };

    if (this.position === 'left' || this.position === 'right') {
      return { width: sizes[this.size].width };
    }
    return { height: sizes[this.size].height };
  }

  // Helper method to get transform value
  getTransformValue(): string {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      top: 'translateY(-100%)',
      bottom: 'translateY(100%)'
    };
    return transforms[this.position];
  }

  // Helper method to check if drawer is vertical
  isVertical(): boolean {
    return this.position === 'left' || this.position === 'right';
  }

  // Helper method to check if drawer is horizontal
  isHorizontal(): boolean {
    return this.position === 'top' || this.position === 'bottom';
  }

  // Helper method to get z-index
  getZIndex(): number {
    return 50;
  }

  // Helper method to get ARIA attributes
  getAriaAttributes(): { [key: string]: string } {
    return {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': this.title ? 'drawer-title' : undefined
    };
  }
}