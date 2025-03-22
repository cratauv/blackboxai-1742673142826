import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RenderedRange {
  start: number;
  end: number;
}

@Component({
  selector: 'app-virtual-scroll',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative overflow-auto"
      [style.height]="height"
      (scroll)="onScroll($event)"
      #viewport
    >
      <!-- Spacer to maintain scroll height -->
      <div
        class="absolute w-full"
        [style.height.px]="totalContentHeight"
      ></div>

      <!-- Rendered items container -->
      <div
        class="absolute w-full"
        [style.transform]="'translateY(' + topOffset + 'px)'"
      >
        @for (item of visibleItems; track trackBy(item)) {
          <div
            [style.height.px]="itemHeight"
            [style.minHeight.px]="itemHeight"
          >
            <ng-container
              [ngTemplateOutlet]="itemTemplate"
              [ngTemplateOutletContext]="{ $implicit: item, index: getItemIndex(item) }"
            ></ng-container>
          </div>
        }

        <!-- Loading indicator -->
        @if (loading) {
          <div class="flex items-center justify-center p-4">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
          </div>
        }

        <!-- Empty state -->
        @if (!loading && items.length === 0) {
          <div class="flex items-center justify-center p-8 text-gray-500">
            {{ emptyMessage }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class VirtualScrollComponent implements OnInit, OnDestroy {
  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLElement>;

  @Input() items: any[] = [];
  @Input() itemHeight = 50;
  @Input() height = '400px';
  @Input() buffer = 3;
  @Input() loading = false;
  @Input() emptyMessage = 'No items to display';
  @Input() itemTemplate: any;
  @Input() trackBy: (item: any) => any = item => item;

  @Output() rangeChange = new EventEmitter<RenderedRange>();
  @Output() endReached = new EventEmitter<void>();

  visibleItems: any[] = [];
  topOffset = 0;
  private scrollListener?: () => void;
  private resizeObserver?: ResizeObserver;
  private lastScrollTop = 0;
  private endReachedTriggered = false;

  ngOnInit(): void {
    this.setupScrollListener();
    this.setupResizeObserver();
    this.updateVisibleItems();
  }

  ngOnDestroy(): void {
    this.removeScrollListener();
    this.removeResizeObserver();
  }

  ngOnChanges(): void {
    this.updateVisibleItems();
  }

  private setupScrollListener(): void {
    this.scrollListener = () => {
      requestAnimationFrame(() => this.updateVisibleItems());
    };
    this.viewport.nativeElement.addEventListener('scroll', this.scrollListener);
  }

  private removeScrollListener(): void {
    if (this.scrollListener) {
      this.viewport.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateVisibleItems();
    });
    this.resizeObserver.observe(this.viewport.nativeElement);
  }

  private removeResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    // Detect scroll direction
    const scrollingDown = scrollTop > this.lastScrollTop;
    this.lastScrollTop = scrollTop;

    // Check if reached the end
    if (scrollingDown && 
        !this.loading && 
        !this.endReachedTriggered && 
        scrollHeight - scrollTop - clientHeight < this.itemHeight * 2) {
      this.endReachedTriggered = true;
      this.endReached.emit();
    }

    // Reset end reached flag when scrolling up
    if (!scrollingDown) {
      this.endReachedTriggered = false;
    }
  }

  private updateVisibleItems(): void {
    const scrollTop = this.viewport.nativeElement.scrollTop;
    const viewportHeight = this.viewport.nativeElement.clientHeight;

    // Calculate visible range
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.min(
      Math.ceil((scrollTop + viewportHeight) / this.itemHeight),
      this.items.length
    );

    // Add buffer
    const start = Math.max(0, startIndex - this.buffer);
    const end = Math.min(this.items.length, endIndex + this.buffer);

    // Update visible items
    this.visibleItems = this.items.slice(start, end);
    this.topOffset = start * this.itemHeight;

    // Emit range change
    this.rangeChange.emit({ start, end });
  }

  get totalContentHeight(): number {
    return this.items.length * this.itemHeight;
  }

  getItemIndex(item: any): number {
    return this.items.indexOf(item);
  }

  // Helper method to scroll to specific item
  scrollToItem(index: number, behavior: ScrollBehavior = 'auto'): void {
    if (index < 0 || index >= this.items.length) return;

    const scrollTop = index * this.itemHeight;
    this.viewport.nativeElement.scrollTo({
      top: scrollTop,
      behavior
    });
  }

  // Helper method to scroll to top
  scrollToTop(behavior: ScrollBehavior = 'auto'): void {
    this.scrollToItem(0, behavior);
  }

  // Helper method to scroll to bottom
  scrollToBottom(behavior: ScrollBehavior = 'auto'): void {
    this.scrollToItem(this.items.length - 1, behavior);
  }

  // Helper method to get current scroll position
  getScrollPosition(): { scrollTop: number; scrollHeight: number; clientHeight: number } {
    const { scrollTop, scrollHeight, clientHeight } = this.viewport.nativeElement;
    return { scrollTop, scrollHeight, clientHeight };
  }

  // Helper method to check if scrolled to bottom
  isScrolledToBottom(): boolean {
    const { scrollTop, scrollHeight, clientHeight } = this.getScrollPosition();
    return scrollHeight - scrollTop - clientHeight < 1;
  }

  // Helper method to check if scrolled to top
  isScrolledToTop(): boolean {
    return this.viewport.nativeElement.scrollTop === 0;
  }

  // Helper method to get visible range
  getVisibleRange(): RenderedRange {
    const scrollTop = this.viewport.nativeElement.scrollTop;
    const viewportHeight = this.viewport.nativeElement.clientHeight;

    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.min(
      Math.ceil((scrollTop + viewportHeight) / this.itemHeight),
      this.items.length
    );

    return { start: startIndex, end: endIndex };
  }

  // Helper method to check if item is visible
  isItemVisible(index: number): boolean {
    const { start, end } = this.getVisibleRange();
    return index >= start && index < end;
  }

  // Helper method to refresh view
  refresh(): void {
    this.updateVisibleItems();
  }
}