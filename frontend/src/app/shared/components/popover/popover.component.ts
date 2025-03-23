import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type PopoverPosition = 'top' | 'right' | 'bottom' | 'left';
type PopoverTrigger = 'hover' | 'click' | 'focus';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative inline-block"
      #container
      (mouseenter)="onTrigger('hover', true)"
      (mouseleave)="onTrigger('hover', false)"
      (click)="onTrigger('click')"
      (focus)="onTrigger('focus', true)"
      (blur)="onTrigger('focus', false)"
    >
      <!-- Trigger Element -->
      <div [class.cursor-pointer]="trigger === 'click'">
        <ng-content></ng-content>
      </div>

      <!-- Popover -->
      @if (isVisible) {
        <div
          #popover
          class="absolute z-50"
          [class]="getPositionClasses()"
          role="tooltip"
        >
          <!-- Arrow -->
          <div
            class="absolute w-2 h-2 bg-white transform rotate-45"
            [class]="getArrowClasses()"
          ></div>

          <!-- Content -->
          <div
            class="relative bg-white rounded-lg shadow-lg overflow-hidden"
            [class]="getContentClasses()"
          >
            <!-- Header -->
            @if (title) {
              <div class="px-4 py-3 border-b">
                <h3 class="text-sm font-medium text-gray-900">
                  {{ title }}
                </h3>
              </div>
            }

            <!-- Body -->
            <div [class]="getBodyClasses()">
              @if (hasCustomTemplate) {
                <ng-container [ngTemplateOutlet]="content"></ng-container>
              } @else {
                {{ content }}
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PopoverComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef<HTMLElement>;
  @ViewChild('popover') popover!: ElementRef<HTMLElement>;

  @Input() content: any;
  @Input() title = '';
  @Input() position: PopoverPosition = 'top';
  @Input() trigger: PopoverTrigger = 'hover';
  @Input() offset = 8;
  @Input() width = 'auto';
  @Input() interactive = false;
  @Input() arrow = true;
  @Input() delay = 0;

  isVisible = false;
  hasCustomTemplate = false;
  private showTimeout?: number;
  private hideTimeout?: number;

  ngAfterViewInit(): void {
    this.hasCustomTemplate = this.content?.['_declarationTContainer'] !== undefined;
  }

  onTrigger(triggerType: PopoverTrigger, isShow = true): void {
    if (this.trigger !== triggerType) return;

    if (triggerType === 'click') {
      this.toggle();
    } else {
      if (isShow) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  show(): void {
    this.clearTimeouts();
    if (this.delay > 0) {
      this.showTimeout = window.setTimeout(() => {
        this.isVisible = true;
        this.updatePosition();
      }, this.delay);
    } else {
      this.isVisible = true;
      this.updatePosition();
    }
  }

  hide(): void {
    this.clearTimeouts();
    if (this.delay > 0) {
      this.hideTimeout = window.setTimeout(() => {
        this.isVisible = false;
      }, this.delay);
    } else {
      this.isVisible = false;
    }
  }

  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  private updatePosition(): void {
    if (!this.popover || !this.container) return;

    const triggerRect = this.container.nativeElement.getBoundingClientRect();
    const popoverRect = this.popover.nativeElement.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (this.position) {
      case 'top':
        top = -popoverRect.height - this.offset;
        left = (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'right':
        top = (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.width + this.offset;
        break;
      case 'bottom':
        top = triggerRect.height + this.offset;
        left = (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'left':
        top = (triggerRect.height - popoverRect.height) / 2;
        left = -popoverRect.width - this.offset;
        break;
    }

    this.popover.nativeElement.style.transform = `translate(${left}px, ${top}px)`;
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }

  getPositionClasses(): string {
    const positions = {
      top: 'bottom-full mb-2',
      right: 'left-full ml-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2'
    };
    return positions[this.position];
  }

  getArrowClasses(): string {
    if (!this.arrow) return 'hidden';

    const positions = {
      top: '-bottom-1 left-1/2 -translate-x-1/2',
      right: '-left-1 top-1/2 -translate-y-1/2',
      bottom: '-top-1 left-1/2 -translate-x-1/2',
      left: '-right-1 top-1/2 -translate-y-1/2'
    };
    return positions[this.position];
  }

  getContentClasses(): string {
    return `
      ${this.interactive ? 'pointer-events-auto' : 'pointer-events-none'}
      ${this.width !== 'auto' ? `w-${this.width}` : ''}
    `;
  }

  getBodyClasses(): string {
    return `
      px-4 py-3
      ${this.hasCustomTemplate ? '' : 'text-sm text-gray-700'}
    `;
  }

  // Helper method to set content
  setContent(content: any): void {
    this.content = content;
    this.hasCustomTemplate = content?.['_declarationTContainer'] !== undefined;
  }

  // Helper method to set position
  setPosition(position: PopoverPosition): void {
    this.position = position;
    if (this.isVisible) {
      this.updatePosition();
    }
  }

  // Helper method to set trigger
  setTrigger(trigger: PopoverTrigger): void {
    this.trigger = trigger;
  }

  // Helper method to set offset
  setOffset(offset: number): void {
    this.offset = offset;
    if (this.isVisible) {
      this.updatePosition();
    }
  }

  // Helper method to set width
  setWidth(width: string): void {
    this.width = width;
  }

  // Helper method to toggle interactive mode
  toggleInteractive(interactive: boolean): void {
    this.interactive = interactive;
  }

  // Helper method to toggle arrow
  toggleArrow(arrow: boolean): void {
    this.arrow = arrow;
  }

  // Helper method to set delay
  setDelay(delay: number): void {
    this.delay = delay;
  }

  // Helper method to check if popover is visible
  isShown(): boolean {
    return this.isVisible;
  }

  // Helper method to get dimensions
  getDimensions(): { width: number; height: number } {
    return this.popover?.nativeElement.getBoundingClientRect() || { width: 0, height: 0 };
  }

  // Helper method to get trigger dimensions
  getTriggerDimensions(): { width: number; height: number } {
    return this.container?.nativeElement.getBoundingClientRect() || { width: 0, height: 0 };
  }

  // Helper method to check if has title
  hasTitle(): boolean {
    return !!this.title;
  }

  // Helper method to check if has custom template
  hasCustomContent(): boolean {
    return this.hasCustomTemplate;
  }
}