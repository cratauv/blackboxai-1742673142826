import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
type TooltipTrigger = 'hover' | 'click' | 'focus';

@Component({
  selector: 'app-tooltip',
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
      <!-- Content -->
      <ng-content></ng-content>

      <!-- Tooltip -->
      @if (isVisible) {
        <div
          #tooltip
          role="tooltip"
          class="absolute z-50 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded shadow-sm max-w-xs"
          [class.invisible]="!isVisible"
          [style.width]="width"
          [attr.data-position]="position"
        >
          <!-- Arrow -->
          <div
            class="absolute w-2 h-2 bg-gray-900 transform rotate-45"
            [class]="getArrowClasses()"
          ></div>

          <!-- Content -->
          <div class="relative z-10">
            @if (hasCustomTemplate) {
              <ng-container [ngTemplateOutlet]="content"></ng-container>
            } @else {
              {{ content }}
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    [data-position='top'] {
      bottom: calc(100% + 5px);
      left: 50%;
      transform: translateX(-50%);
    }

    [data-position='right'] {
      left: calc(100% + 5px);
      top: 50%;
      transform: translateY(-50%);
    }

    [data-position='bottom'] {
      top: calc(100% + 5px);
      left: 50%;
      transform: translateX(-50%);
    }

    [data-position='left'] {
      right: calc(100% + 5px);
      top: 50%;
      transform: translateY(-50%);
    }
  `]
})
export class TooltipComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef<HTMLElement>;
  @ViewChild('tooltip') tooltip!: ElementRef<HTMLElement>;

  @Input() content: any;
  @Input() position: TooltipPosition = 'top';
  @Input() trigger: TooltipTrigger = 'hover';
  @Input() delay = 0;
  @Input() width = 'auto';
  @Input() disabled = false;
  @Input() interactive = false;

  isVisible = false;
  hasCustomTemplate = false;
  private showTimeout?: number;
  private hideTimeout?: number;

  ngAfterViewInit(): void {
    this.hasCustomTemplate = this.content?.['_declarationTContainer'] !== undefined;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (this.interactive && this.tooltip) {
      this.tooltip.nativeElement.addEventListener('mouseenter', () => {
        if (this.trigger === 'hover') {
          this.clearHideTimeout();
        }
      });

      this.tooltip.nativeElement.addEventListener('mouseleave', () => {
        if (this.trigger === 'hover') {
          this.hide();
        }
      });
    }

    // Handle click outside for click trigger
    if (this.trigger === 'click') {
      document.addEventListener('click', this.handleClickOutside.bind(this));
    }
  }

  private handleClickOutside(event: MouseEvent): void {
    if (!this.container.nativeElement.contains(event.target as Node)) {
      this.hide();
    }
  }

  onTrigger(triggerType: TooltipTrigger, isShow = true): void {
    if (this.disabled || this.trigger !== triggerType) return;

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
    if (!this.tooltip) return;

    const tooltipEl = this.tooltip.nativeElement;
    const containerRect = this.container.nativeElement.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();

    // Check if tooltip is outside viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = this.position;

    // Flip position if needed
    if (this.position === 'top' && containerRect.top - tooltipRect.height < 0) {
      newPosition = 'bottom';
    } else if (this.position === 'bottom' && containerRect.bottom + tooltipRect.height > viewportHeight) {
      newPosition = 'top';
    } else if (this.position === 'left' && containerRect.left - tooltipRect.width < 0) {
      newPosition = 'right';
    } else if (this.position === 'right' && containerRect.right + tooltipRect.width > viewportWidth) {
      newPosition = 'left';
    }

    tooltipEl.setAttribute('data-position', newPosition);
  }

  getArrowClasses(): string {
    const positions = {
      top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
      right: 'left-[-4px] top-1/2 -translate-y-1/2',
      bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
      left: 'right-[-4px] top-1/2 -translate-y-1/2'
    };
    return positions[this.position];
  }

  private clearTimeouts(): void {
    this.clearShowTimeout();
    this.clearHideTimeout();
  }

  private clearShowTimeout(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
  }

  private clearHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }

  // Helper method to set content
  setContent(content: any): void {
    this.content = content;
    this.hasCustomTemplate = content?.['_declarationTContainer'] !== undefined;
  }

  // Helper method to set position
  setPosition(position: TooltipPosition): void {
    this.position = position;
    if (this.isVisible) {
      this.updatePosition();
    }
  }

  // Helper method to set trigger
  setTrigger(trigger: TooltipTrigger): void {
    this.trigger = trigger;
  }

  // Helper method to check if tooltip is visible
  isShown(): boolean {
    return this.isVisible;
  }

  // Helper method to force update position
  updateTooltipPosition(): void {
    if (this.isVisible) {
      this.updatePosition();
    }
  }

  // Helper method to enable/disable tooltip
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    if (disabled && this.isVisible) {
      this.hide();
    }
  }

  // Helper method to set delay
  setDelay(delay: number): void {
    this.delay = delay;
  }

  // Helper method to set width
  setWidth(width: string): void {
    this.width = width;
  }

  // Helper method to set interactivity
  setInteractive(interactive: boolean): void {
    this.interactive = interactive;
    if (this.tooltip) {
      this.setupEventListeners();
    }
  }
}