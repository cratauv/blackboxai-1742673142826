import { Component, Input, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
type TooltipTrigger = 'hover' | 'click' | 'focus';
type TooltipVariant = 'dark' | 'light';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-block relative" (mouseleave)="hideTooltip()">
      <!-- Content that triggers the tooltip -->
      <div
        (mouseenter)="showTooltip()"
        (click)="onTriggerClick()"
        (focus)="onTriggerFocus()"
        (blur)="onTriggerBlur()"
      >
        <ng-content></ng-content>
      </div>

      <!-- Tooltip -->
      @if (isVisible) {
        <div
          role="tooltip"
          [class]="getTooltipClasses()"
          [style.max-width]="maxWidth"
        >
          <!-- Arrow -->
          <div
            [class]="getArrowClasses()"
            [style.--tooltip-arrow-size.px]="arrowSize"
          ></div>

          <!-- Content -->
          <div [class]="getContentClasses()">
            @if (icon) {
              <i [class]="icon + ' mr-1'"></i>
            }
            {{ content }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      --tooltip-arrow-size: 6px;
    }

    .tooltip-arrow::before {
      content: '';
      position: absolute;
      border: var(--tooltip-arrow-size) solid transparent;
    }

    .tooltip-top .tooltip-arrow::before {
      bottom: -12px;
      border-top-color: currentColor;
    }

    .tooltip-right .tooltip-arrow::before {
      left: -12px;
      border-right-color: currentColor;
    }

    .tooltip-bottom .tooltip-arrow::before {
      top: -12px;
      border-bottom-color: currentColor;
    }

    .tooltip-left .tooltip-arrow::before {
      right: -12px;
      border-left-color: currentColor;
    }
  `]
})
export class TooltipComponent implements OnDestroy {
  @Input() content = '';
  @Input() position: TooltipPosition = 'top';
  @Input() trigger: TooltipTrigger = 'hover';
  @Input() variant: TooltipVariant = 'dark';
  @Input() delay = 200;
  @Input() maxWidth = '200px';
  @Input() arrowSize = 6;
  @Input() icon = '';
  @Input() interactive = false;

  isVisible = false;
  private showTimeout?: number;
  private hideTimeout?: number;

  constructor(private elementRef: ElementRef) {}

  ngOnDestroy(): void {
    this.clearTimeouts();
  }

  getTooltipClasses(): string {
    const baseClasses = 'absolute z-50 px-2 py-1 text-sm rounded shadow-lg';
    const positionClasses = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2'
    };

    const variantClasses = {
      dark: 'bg-gray-900 text-white',
      light: 'bg-white text-gray-900 border border-gray-200'
    };

    return `
      ${baseClasses}
      ${positionClasses[this.position]}
      ${variantClasses[this.variant]}
      tooltip-${this.position}
    `;
  }

  getArrowClasses(): string {
    const baseClasses = 'absolute tooltip-arrow';
    const positionClasses = {
      top: 'bottom-0 left-1/2 -translate-x-1/2',
      right: 'left-0 top-1/2 -translate-y-1/2',
      bottom: 'top-0 left-1/2 -translate-x-1/2',
      left: 'right-0 top-1/2 -translate-y-1/2'
    };

    const colorClass = this.variant === 'dark' ? 'text-gray-900' : 'text-white';

    return `${baseClasses} ${positionClasses[this.position]} ${colorClass}`;
  }

  getContentClasses(): string {
    return 'flex items-center whitespace-nowrap';
  }

  showTooltip(): void {
    this.clearTimeouts();
    if (this.trigger === 'hover') {
      this.showTimeout = window.setTimeout(() => {
        this.isVisible = true;
      }, this.delay);
    }
  }

  hideTooltip(): void {
    this.clearTimeouts();
    if (this.trigger === 'hover') {
      this.hideTimeout = window.setTimeout(() => {
        this.isVisible = false;
      }, this.interactive ? 300 : 0);
    }
  }

  onTriggerClick(): void {
    if (this.trigger === 'click') {
      this.isVisible = !this.isVisible;
    }
  }

  onTriggerFocus(): void {
    if (this.trigger === 'focus') {
      this.isVisible = true;
    }
  }

  onTriggerBlur(): void {
    if (this.trigger === 'focus') {
      this.isVisible = false;
    }
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  // Helper method to show tooltip programmatically
  show(): void {
    this.isVisible = true;
  }

  // Helper method to hide tooltip programmatically
  hide(): void {
    this.isVisible = false;
  }

  // Helper method to toggle tooltip programmatically
  toggle(): void {
    this.isVisible = !this.isVisible;
  }

  // Helper method to set content
  setContent(content: string): void {
    this.content = content;
  }

  // Helper method to set position
  setPosition(position: TooltipPosition): void {
    this.position = position;
  }

  // Helper method to set trigger
  setTrigger(trigger: TooltipTrigger): void {
    this.trigger = trigger;
  }

  // Helper method to set variant
  setVariant(variant: TooltipVariant): void {
    this.variant = variant;
  }

  // Helper method to set delay
  setDelay(delay: number): void {
    this.delay = delay;
  }

  // Helper method to set max width
  setMaxWidth(maxWidth: string): void {
    this.maxWidth = maxWidth;
  }

  // Helper method to set arrow size
  setArrowSize(size: number): void {
    this.arrowSize = size;
  }

  // Helper method to set icon
  setIcon(icon: string): void {
    this.icon = icon;
  }

  // Helper method to toggle interactive mode
  toggleInteractive(interactive: boolean): void {
    this.interactive = interactive;
  }

  // Helper method to check if tooltip is visible
  isShown(): boolean {
    return this.isVisible;
  }

  // Helper method to get current position
  getPosition(): TooltipPosition {
    return this.position;
  }

  // Helper method to get trigger type
  getTrigger(): TooltipTrigger {
    return this.trigger;
  }
}