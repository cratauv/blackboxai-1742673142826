import { Component, Input, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
type TooltipTheme = 'dark' | 'light';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-block relative" (mouseenter)="show()" (mouseleave)="hide()">
      <!-- Content that triggers the tooltip -->
      <ng-content></ng-content>

      <!-- Tooltip -->
      @if (isVisible) {
        <div
          class="absolute z-50 px-2 py-1 text-sm whitespace-nowrap"
          [class]="getPositionClasses()"
          [@tooltipAnimation]
          role="tooltip"
        >
          <!-- Arrow -->
          <div
            class="absolute w-2 h-2 transform rotate-45"
            [class]="getArrowClasses()"
          ></div>

          <!-- Content -->
          <div
            class="relative rounded px-2 py-1"
            [class]="getThemeClasses()"
          >
            {{ content }}
          </div>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('tooltipAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ],
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class TooltipComponent implements OnDestroy {
  @Input() content = '';
  @Input() position: TooltipPosition = 'top';
  @Input() theme: TooltipTheme = 'dark';
  @Input() delay = 200;
  @Input() maxWidth = '200px';
  @Input() showArrow = true;

  isVisible = false;
  private timeoutId?: number;

  constructor(private elementRef: ElementRef) {}

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  show(): void {
    this.clearTimeout();
    this.timeoutId = window.setTimeout(() => {
      this.isVisible = true;
    }, this.delay);
  }

  hide(): void {
    this.clearTimeout();
    this.isVisible = false;
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  getPositionClasses(): string {
    const positions: Record<TooltipPosition, string> = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2'
    };

    return positions[this.position];
  }

  getArrowClasses(): string {
    if (!this.showArrow) return 'hidden';

    const arrowPositions: Record<TooltipPosition, string> = {
      top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
      right: 'left-[-4px] top-1/2 -translate-y-1/2',
      bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
      left: 'right-[-4px] top-1/2 -translate-y-1/2'
    };

    const themeClasses = this.theme === 'dark' 
      ? 'bg-gray-800'
      : 'bg-white border-gray-200';

    return `${arrowPositions[this.position]} ${themeClasses}`;
  }

  getThemeClasses(): string {
    const themes: Record<TooltipTheme, string> = {
      dark: 'bg-gray-800 text-white',
      light: 'bg-white text-gray-900 border border-gray-200 shadow-sm'
    };

    return themes[this.theme];
  }

  // Helper method to check if tooltip should be shown
  shouldShow(): boolean {
    return !!this.content && this.isVisible;
  }

  // Helper method to get computed position
  getComputedPosition(): { top: string; left: string } {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: `${rect.top + scrollTop}px`,
      left: `${rect.left + scrollLeft}px`
    };
  }

  // Helper method to check if tooltip fits in viewport
  checkViewportFit(): TooltipPosition {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check if default position fits, otherwise return alternative position
    switch (this.position) {
      case 'top':
        return rect.top < 50 ? 'bottom' : 'top';
      case 'right':
        return rect.right + 50 > viewportWidth ? 'left' : 'right';
      case 'bottom':
        return rect.bottom + 50 > viewportHeight ? 'top' : 'bottom';
      case 'left':
        return rect.left < 50 ? 'right' : 'left';
      default:
        return this.position;
    }
  }
}