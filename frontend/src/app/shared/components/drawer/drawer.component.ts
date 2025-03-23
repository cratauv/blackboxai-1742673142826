import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 overflow-hidden"
      [class.hidden]="!isOpen"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black transition-opacity"
        [class.bg-opacity-50]="!loading"
        [class.bg-opacity-75]="loading"
        [@fadeInOut]="isOpen"
        (click)="onBackdropClick()"
      ></div>

      <!-- Drawer Panel -->
      <div
        class="absolute inset-y-0 overflow-hidden"
        [class]="getPanelPositionClasses()"
      >
        <div
          #drawer
          class="flex h-full flex-col overflow-y-auto bg-white shadow-xl"
          [class]="getPanelSizeClasses()"
          [@slideInOut]="getAnimationState()"
        >
          <!-- Loading State -->
          @if (loading) {
            <div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          }

          <!-- Header -->
          @if (title || showCloseButton) {
            <div class="px-4 py-6 sm:px-6 border-b">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">
                  {{ title }}
                </h2>
                @if (showCloseButton) {
                  <button
                    type="button"
                    class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    (click)="close()"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                }
              </div>
            </div>
          }

          <!-- Content -->
          <div class="relative flex-1 px-4 py-6 sm:px-6">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (showFooter) {
            <div class="flex justify-end px-4 py-4 sm:px-6 border-t space-x-2">
              @if (showCancelButton) {
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  [disabled]="loading"
                  (click)="cancel()"
                >
                  {{ cancelText }}
                </button>
              }
              @if (showConfirmButton) {
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  [disabled]="loading"
                  (click)="confirm()"
                >
                  {{ confirmText }}
                </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style(position => ({
          transform: getInitialTransform(position)
        })),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'none' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style(position => ({
          transform: getInitialTransform(position)
        })))
      ])
    ])
  ]
})
export class DrawerComponent {
  @ViewChild('drawer') drawer!: ElementRef;

  @Input() isOpen = false;
  @Input() position: DrawerPosition = 'right';
  @Input() size: DrawerSize = 'md';
  @Input() title = '';
  @Input() loading = false;
  @Input() showCloseButton = true;
  @Input() showFooter = true;
  @Input() showCancelButton = true;
  @Input() showConfirmButton = true;
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  @Input() preventScroll = true;

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  private readonly sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    full: 'max-w-full'
  };

  ngOnInit(): void {
    if (this.closeOnEscape) {
      document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (this.closeOnEscape) {
      document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  private handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  private onOpen(): void {
    if (this.preventScroll) {
      document.body.style.overflow = 'hidden';
    }
    this.opened.emit();
  }

  private onClose(): void {
    if (this.preventScroll) {
      document.body.style.overflow = '';
    }
    this.closed.emit();
  }

  getPanelPositionClasses(): string {
    const positions = {
      left: 'left-0',
      right: 'right-0',
      top: 'top-0 inset-x-0',
      bottom: 'bottom-0 inset-x-0'
    };
    return positions[this.position];
  }

  getPanelSizeClasses(): string {
    if (this.position === 'top' || this.position === 'bottom') {
      return 'w-full';
    }
    return `w-screen ${this.sizeMap[this.size]}`;
  }

  getAnimationState(): string {
    return this.position;
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop && !this.loading) {
      this.close();
    }
  }

  close(): void {
    if (!this.loading) {
      this.isOpen = false;
      this.onClose();
    }
  }

  cancel(): void {
    if (!this.loading) {
      this.cancelled.emit();
      this.close();
    }
  }

  confirm(): void {
    if (!this.loading) {
      this.confirmed.emit();
      this.close();
    }
  }

  // Helper method to open drawer
  open(): void {
    this.isOpen = true;
    this.onOpen();
  }

  // Helper method to set loading state
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  // Helper method to set position
  setPosition(position: DrawerPosition): void {
    this.position = position;
  }

  // Helper method to set size
  setSize(size: DrawerSize): void {
    this.size = size;
  }

  // Helper method to set title
  setTitle(title: string): void {
    this.title = title;
  }

  // Helper method to set button text
  setButtonText(cancel: string, confirm: string): void {
    this.cancelText = cancel;
    this.confirmText = confirm;
  }

  // Helper method to toggle buttons
  toggleButtons(showCancel: boolean, showConfirm: boolean): void {
    this.showCancelButton = showCancel;
    this.showConfirmButton = showConfirm;
  }

  // Helper method to check if drawer is open
  isDrawerOpen(): boolean {
    return this.isOpen;
  }

  // Helper method to get dimensions
  getDimensions(): { width: string; height: string } {
    const drawer = this.drawer?.nativeElement;
    return drawer ? {
      width: window.getComputedStyle(drawer).width,
      height: window.getComputedStyle(drawer).height
    } : { width: '0', height: '0' };
  }
}

// Animation helper function
function getInitialTransform(position: DrawerPosition): string {
  switch (position) {
    case 'left':
      return 'translateX(-100%)';
    case 'right':
      return 'translateX(100%)';
    case 'top':
      return 'translateY(-100%)';
    case 'bottom':
      return 'translateY(100%)';
    default:
      return '';
  }
}