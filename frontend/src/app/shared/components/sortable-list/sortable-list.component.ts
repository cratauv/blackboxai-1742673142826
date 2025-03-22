import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DragState {
  index: number;
  element: HTMLElement;
  placeholder: HTMLElement;
  startY: number;
  currentY: number;
  offsetY: number;
  height: number;
}

@Component({
  selector: 'app-sortable-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #container
      class="relative"
      [class.cursor-move]="!disabled"
    >
      <!-- List Items -->
      @for (item of items; track trackBy(item)) {
        <div
          class="relative transition-transform duration-200"
          [class.opacity-50]="isDragging && dragState?.index === i"
          [style.transform]="getItemTransform(i)"
          [attr.data-index]="i"
        >
          <!-- Drag Handle -->
          @if (!disabled) {
            <div
              class="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-move hover:bg-gray-50 group"
              (mousedown)="onDragStart($event, i)"
              (touchstart)="onTouchStart($event, i)"
            >
              <i class="fas fa-grip-vertical text-gray-400 group-hover:text-gray-600"></i>
            </div>
          }

          <!-- Item Content -->
          <div
            class="relative"
            [class.pl-8]="!disabled"
            [class.pointer-events-none]="isDragging"
          >
            <ng-container
              [ngTemplateOutlet]="itemTemplate"
              [ngTemplateOutletContext]="{ $implicit: item, index: i }"
            ></ng-container>
          </div>

          <!-- Drag Placeholder -->
          @if (isDragging && dragState?.index === i) {
            <div
              class="absolute inset-0 border-2 border-dashed border-primary-500 rounded-lg bg-primary-50 bg-opacity-50"
              [style.height.px]="dragState?.height"
            ></div>
          }
        </div>
      }

      <!-- Empty State -->
      @if (items.length === 0) {
        <div class="p-8 text-center text-gray-500">
          {{ emptyMessage }}
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SortableListComponent {
  @ViewChild('container') container!: ElementRef<HTMLElement>;

  @Input() items: any[] = [];
  @Input() disabled = false;
  @Input() emptyMessage = 'No items to display';
  @Input() itemTemplate: any;
  @Input() trackBy: (item: any) => any = item => item;

  @Output() itemsChange = new EventEmitter<any[]>();
  @Output() orderChange = new EventEmitter<{ oldIndex: number; newIndex: number }>();

  isDragging = false;
  dragState?: DragState;

  onDragStart(event: MouseEvent, index: number): void {
    if (this.disabled) return;
    event.preventDefault();
    
    const element = this.getItemElement(index);
    if (!element) return;

    this.startDrag(element, index, event.pageY);
    
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onDragEnd);
  }

  onTouchStart(event: TouchEvent, index: number): void {
    if (this.disabled) return;
    event.preventDefault();
    
    const element = this.getItemElement(index);
    if (!element) return;

    this.startDrag(element, index, event.touches[0].pageY);
    
    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onDragEnd);
  }

  private startDrag(element: HTMLElement, index: number, pageY: number): void {
    const rect = element.getBoundingClientRect();
    const height = rect.height;

    this.isDragging = true;
    this.dragState = {
      index,
      element,
      placeholder: element.cloneNode(true) as HTMLElement,
      startY: pageY,
      currentY: pageY,
      offsetY: pageY - rect.top,
      height
    };

    element.style.width = `${rect.width}px`;
    element.style.height = `${rect.height}px`;
    element.style.position = 'fixed';
    element.style.zIndex = '1000';
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
  }

  private readonly onMouseMove = (event: MouseEvent): void => {
    if (!this.dragState) return;
    this.updateDragPosition(event.pageY);
  };

  private readonly onTouchMove = (event: TouchEvent): void => {
    if (!this.dragState) return;
    this.updateDragPosition(event.touches[0].pageY);
  };

  private readonly onDragEnd = (): void => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onDragEnd);

    if (!this.dragState) return;

    const oldIndex = this.dragState.index;
    const newIndex = this.getNewIndex();

    if (oldIndex !== newIndex) {
      const newItems = [...this.items];
      const [item] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, item);
      
      this.items = newItems;
      this.itemsChange.emit(this.items);
      this.orderChange.emit({ oldIndex, newIndex });
    }

    this.resetDragState();
  };

  private updateDragPosition(pageY: number): void {
    if (!this.dragState) return;

    this.dragState.currentY = pageY;
    const deltaY = pageY - this.dragState.startY;
    
    this.dragState.element.style.transform = `translateY(${deltaY}px)`;
    
    const newIndex = this.getNewIndex();
    if (newIndex !== this.dragState.index) {
      this.dragState.index = newIndex;
    }
  }

  private getNewIndex(): number {
    if (!this.dragState) return -1;

    const containerRect = this.container.nativeElement.getBoundingClientRect();
    const currentY = this.dragState.currentY - containerRect.top - this.dragState.offsetY;
    
    const items = Array.from(this.container.nativeElement.children);
    let closestIndex = this.dragState.index;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
      if (index === this.dragState?.index) return;

      const rect = item.getBoundingClientRect();
      const itemMiddle = rect.top + rect.height / 2 - containerRect.top;
      const distance = Math.abs(currentY - itemMiddle);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  private resetDragState(): void {
    if (!this.dragState) return;

    this.dragState.element.style.removeProperty('width');
    this.dragState.element.style.removeProperty('height');
    this.dragState.element.style.removeProperty('position');
    this.dragState.element.style.removeProperty('z-index');
    this.dragState.element.style.removeProperty('left');
    this.dragState.element.style.removeProperty('top');
    this.dragState.element.style.removeProperty('transform');

    this.isDragging = false;
    this.dragState = undefined;
  }

  private getItemElement(index: number): HTMLElement | null {
    return this.container.nativeElement.children[index] as HTMLElement;
  }

  getItemTransform(index: number): string {
    if (!this.isDragging || !this.dragState) return '';
    
    const dragIndex = this.dragState.index;
    if (index === dragIndex) return '';

    if (
      (index > dragIndex && index <= this.getNewIndex()) ||
      (index < dragIndex && index >= this.getNewIndex())
    ) {
      const direction = index > dragIndex ? -1 : 1;
      return `translateY(${direction * this.dragState.height}px)`;
    }

    return '';
  }

  // Helper method to move item
  moveItem(fromIndex: number, toIndex: number): void {
    const newItems = [...this.items];
    const [item] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, item);
    
    this.items = newItems;
    this.itemsChange.emit(this.items);
    this.orderChange.emit({ oldIndex: fromIndex, newIndex: toIndex });
  }

  // Helper method to add item
  addItem(item: any, index?: number): void {
    const newItems = [...this.items];
    if (index === undefined) {
      newItems.push(item);
    } else {
      newItems.splice(index, 0, item);
    }
    
    this.items = newItems;
    this.itemsChange.emit(this.items);
  }

  // Helper method to remove item
  removeItem(index: number): void {
    const newItems = [...this.items];
    newItems.splice(index, 1);
    
    this.items = newItems;
    this.itemsChange.emit(this.items);
  }

  // Helper method to swap items
  swapItems(index1: number, index2: number): void {
    const newItems = [...this.items];
    [newItems[index1], newItems[index2]] = [newItems[index2], newItems[index1]];
    
    this.items = newItems;
    this.itemsChange.emit(this.items);
    this.orderChange.emit({ oldIndex: index1, newIndex: index2 });
  }

  // Helper method to check if item can be moved
  canMove(fromIndex: number, toIndex: number): boolean {
    return fromIndex >= 0 && fromIndex < this.items.length &&
           toIndex >= 0 && toIndex < this.items.length &&
           fromIndex !== toIndex;
  }

  // Helper method to get item position
  getItemPosition(item: any): number {
    return this.items.findIndex(i => this.trackBy(i) === this.trackBy(item));
  }

  // Helper method to clear list
  clear(): void {
    this.items = [];
    this.itemsChange.emit(this.items);
  }
}