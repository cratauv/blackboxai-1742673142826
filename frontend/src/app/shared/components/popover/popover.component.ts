import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type PopoverPosition = 'top' | 'right' | 'bottom' | 'left';
type PopoverTrigger = 'hover' | 'click';
type PopoverSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <!-- Trigger Element -->
      <div
        #trigger
        (mouseenter)="onTriggerHover(true)"
        (mouseleave)="onTriggerHover(false)"
        (click)="onTriggerClick()"
        [class.cursor-pointer]="trigger === 'click'"
      >
        <ng-content select="[popoverTrigger]"></ng-content>
      </div>

      <!-- Popover Content -->
      @if (isVisible) {
        <div
          #content
          class="absolute z-50"
          [class]="getPositionClasses()"
          (mouseenter)="onContentHover(true)"
          (mouseleave)="onContentHover(false)"
          [@popoverAnimation]
          role="tooltip"
        >
          <!-- Arrow -->
          @if (showArrow) {
            <div
              class="absolute w-2 h-2 transform rotate-45"
              [class]="getArrowClasses()"
            ></div>
          }

          <!-- Content Container -->
          <div
            class="relative rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
            [class]="getContentContainerClasses()"
          >
            <!-- Header -->
            @if (title) {
              <div class="p-3 border-b">
                <h3 class="text-sm font-medium text-gray-900">
                  {{ title }}
                </h3>
              </div>
            }

            <!-- Body -->
            <div [class]="getBodyClasses()">
              <ng-content select="[popoverContent]"></ng-content>
            </div>

            <!-- Footer -->
            @if (showFooter) {
              <div class="p-3 border-t bg-gray-50">
                <ng-content select="[popoverFooter]"></ng-content>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('popoverAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class PopoverComponent {
  @Input() position: PopoverPosition = 'bottom';
  @Input() trigger: PopoverTrigger = 'hover';
  @Input() size: PopoverSize = 'md';
  @Input() title = '';
  @Input() showArrow = true;
  @Input() showFooter = false;
  @Input() closeOnClickOutside = true;
  @Input() offset = 8;

  isVisible = false;
  isHoveringTrigger = false;
  isHoveringContent = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.closeOnClickOutside) return;
    
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.trigger === 'click') {
      this.hide();
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowChange(): void {
    if (this.isVisible) {
      this.updatePosition();
    }
  }

  onTriggerHover(isHovering: boolean): void {
    this.isHoveringTrigger = isHovering;
    if (this.trigger === 'hover') {
      setTimeout(() => {
        this.updateVisibility();
      }, 100);
    }
  }

  onContentHover(isHovering: boolean): void {
    this.isHoveringContent = isHovering;
    if (this.trigger === 'hover') {
      setTimeout(() => {
        this.updateVisibility();
      }, 100);
    }
  }

  onTriggerClick(): void {
    if (this.trigger === 'click') {
      this.toggle();
    }
  }

  getPositionClasses(): string {
    const positions = {
      top: '-top-2 left-1/2 transform -translate-x-1/2 -translate-y-full',
      right: 'top-1/2 -right-2 transform translate-x-full -translate-y-1/2',
      bottom: '-bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full',
      left: 'top-1/2 -left-2 transform -translate-x-full -translate-y-1/2'
    };
    return `${positions[this.position]} mt-${this.offset}`;
  }

  getArrowClasses(): string {
    const positions = {
      top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
      right: 'left-[-4px] top-1/2 -translate-y-1/2',
      bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
      left: 'right-[-4px] top-1/2 -translate-y-1/2'
    };
    return `${positions[this.position]} bg-white`;
  }

  getContentContainerClasses(): string {
    const sizes = {
      sm: 'w-48',
      md: 'w-64',
      lg: 'w-80'
    };
    return `${sizes[this.size]} bg-white`;
  }

  getBodyClasses(): string {
    return this.title || this.showFooter ? 'p-3' : 'p-4';
  }

  show(): void {
    this.isVisible = true;
    setTimeout(() => {
      this.updatePosition();
    });
  }

  hide(): void {
    this.isVisible = false;
  }

  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  private updateVisibility(): void {
    this.isVisible = this.isHoveringTrigger || this.isHoveringContent;
  }

  private updatePosition(): void {
    // Implementation would go here to handle dynamic positioning
    // based on viewport boundaries and scroll position
  }

  // Helper method to get content width
  getContentWidth(): string {
    const widths = {
      sm: '12rem',
      md: '16rem',
      lg: '20rem'
    };
    return widths[this.size];
  }

  // Helper method to get animation duration
  getAnimationDuration(): number {
    return 150; // milliseconds
  }

  // Helper method to get z-index
  getZIndex(): number {
    return 50;
  }

  // Helper method to check if popover fits in viewport
  checkViewportFit(): PopoverPosition {
    // Implementation would go here to determine the best position
    // based on available space in the viewport
    return this.position;
  }

  // Helper method to get offset based on position
  getPositionOffset(): { x: number; y: number } {
    const offsets = {
      top: { x: 0, y: -this.offset },
      right: { x: this.offset, y: 0 },
      bottom: { x: 0, y: this.offset },
      left: { x: -this.offset, y: 0 }
    };
    return offsets[this.position];
  }
}