import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SortableItem {
  id: string | number;
  content: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-sortable-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="w-full"
      [class.cursor-move]="!disabled"
      (dragover)="onDragOver($event)"
    >
      <ul
        role="list"
        class="divide-y divide-gray-200"
        [class.opacity-50]="disabled"
      >
        @for (item of items; track item.id) {
          <li
            [id]="'item-' + item.id"
            class="relative"
            [class]="getItemClasses(item)"
            [attr.draggable]="!disabled && !item.disabled"
            (dragstart)="onDragStart($event, item)"
            (dragend)="onDragEnd()"
            (dragover)="onItemDragOver($event, item)"
            (drop)="onDrop($event, item)"
          >
            <!-- Drag Handle -->
            @if (!disabled && !item.disabled) {
              <div class="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-move">
                <i class="fas fa-grip-vertical text-gray-400"></i>
              </div>
            }

            <!-- Item Content -->
            <div [class]="getContentClasses()">
              @switch (typeof item.content) {
                @case ('string') {
                  {{ item.content }}
                }
                @default {
                  <ng-container [ngTemplateOutlet]="item.content"></ng-container>
                }
              }
            </div>

            <!-- Drop Indicator -->
            @if (draggedItem && draggedItem !== item) {
              <div
                class="absolute inset-x-0"
                [class]="getDropIndicatorClasses(item)"
              ></div>
            }
          </li>
        }
      </ul>

      <!-- Empty State -->
      @if (items.length === 0) {
        <div class="text-center py-6 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">
            {{ emptyMessage }}
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    .drop-above {
      border-top: 2px solid #3b82f6;
    }

    .drop-below {
      border-bottom: 2px solid #3b82f6;
    }
  `]
})
export class SortableListComponent {
  @Input() items: SortableItem[] = [];
  @Input() disabled = false;
  @Input() emptyMessage = 'No items to display';
  @Input() animation = true;

  @Output() itemsChange = new EventEmitter<SortableItem[]>();
  @Output() orderChanged = new EventEmitter<{ oldIndex: number; newIndex: number }>();

  draggedItem: SortableItem | null = null;
  dragOverItem: SortableItem | null = null;
  dragPosition: 'above' | 'below' = 'below';

  getItemClasses(item: SortableItem): string {
    return `
      p-4 bg-white
      ${!this.disabled && !item.disabled ? 'hover:bg-gray-50' : ''}
      ${item === this.draggedItem ? 'opacity-50' : ''}
      ${item.disabled ? 'cursor-not-allowed opacity-50' : ''}
    `;
  }

  getContentClasses(): string {
    return 'pl-8';  // Space for drag handle
  }

  getDropIndicatorClasses(item: SortableItem): string {
    if (item !== this.dragOverItem) return '';
    return this.dragPosition === 'above' ? 'drop-above' : 'drop-below';
  }

  onDragStart(event: DragEvent, item: SortableItem): void {
    if (this.disabled || item.disabled) {
      event.preventDefault();
      return;
    }

    this.draggedItem = item;
    event.dataTransfer?.setData('text/plain', item.id.toString());

    // Set drag image
    const dragImage = document.getElementById('item-' + item.id);
    if (dragImage && event.dataTransfer) {
      event.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  }

  onDragEnd(): void {
    this.draggedItem = null;
    this.dragOverItem = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onItemDragOver(event: DragEvent, item: SortableItem): void {
    event.preventDefault();
    if (this.draggedItem === item) return;

    this.dragOverItem = item;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    this.dragPosition = event.clientY < midY ? 'above' : 'below';
  }

  onDrop(event: DragEvent, targetItem: SortableItem): void {
    event.preventDefault();
    if (!this.draggedItem || this.draggedItem === targetItem) return;

    const oldIndex = this.items.indexOf(this.draggedItem);
    let newIndex = this.items.indexOf(targetItem);

    if (this.dragPosition === 'below') {
      newIndex++;
    }

    // Reorder items
    this.items = [
      ...this.items.slice(0, oldIndex),
      ...this.items.slice(oldIndex + 1)
    ];
    this.items = [
      ...this.items.slice(0, newIndex),
      this.draggedItem,
      ...this.items.slice(newIndex)
    ];

    this.itemsChange.emit(this.items);
    this.orderChanged.emit({ oldIndex, newIndex });
    this.draggedItem = null;
    this.dragOverItem = null;
  }

  // Helper method to move item up
  moveItemUp(index: number): void {
    if (index <= 0) return;
    this.swapItems(index, index - 1);
  }

  // Helper method to move item down
  moveItemDown(index: number): void {
    if (index >= this.items.length - 1) return;
    this.swapItems(index, index + 1);
  }

  // Helper method to move item to top
  moveItemToTop(index: number): void {
    if (index <= 0) return;
    const item = this.items[index];
    this.items.splice(index, 1);
    this.items.unshift(item);
    this.emitChanges(index, 0);
  }

  // Helper method to move item to bottom
  moveItemToBottom(index: number): void {
    if (index >= this.items.length - 1) return;
    const item = this.items[index];
    this.items.splice(index, 1);
    this.items.push(item);
    this.emitChanges(index, this.items.length - 1);
  }

  // Helper method to swap items
  private swapItems(index1: number, index2: number): void {
    [this.items[index1], this.items[index2]] = [this.items[index2], this.items[index1]];
    this.emitChanges(index1, index2);
  }

  // Helper method to emit changes
  private emitChanges(oldIndex: number, newIndex: number): void {
    this.itemsChange.emit(this.items);
    this.orderChanged.emit({ oldIndex, newIndex });
  }

  // Helper method to check if item can move up
  canMoveUp(index: number): boolean {
    return index > 0 && !this.disabled && !this.items[index].disabled;
  }

  // Helper method to check if item can move down
  canMoveDown(index: number): boolean {
    return index < this.items.length - 1 && !this.disabled && !this.items[index].disabled;
  }

  // Helper method to get item index
  getItemIndex(item: SortableItem): number {
    return this.items.indexOf(item);
  }

  // Helper method to check if item is first
  isFirstItem(item: SortableItem): boolean {
    return this.items.indexOf(item) === 0;
  }

  // Helper method to check if item is last
  isLastItem(item: SortableItem): boolean {
    return this.items.indexOf(item) === this.items.length - 1;
  }
}