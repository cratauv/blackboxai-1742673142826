import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  icon?: string;
  badge?: {
    text: string;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  };
  metadata?: { [key: string]: any };
  disabled?: boolean;
  selected?: boolean;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-hidden bg-white">
      <ul 
        role="list" 
        class="divide-y divide-gray-200"
        [class.rounded-lg]="bordered"
        [class.border]="bordered"
      >
        @for (item of items; track item.id) {
          <li 
            [class]="getItemClasses(item)"
            [class.cursor-pointer]="!item.disabled && selectable"
            [class.opacity-50]="item.disabled"
            (click)="onItemClick(item)"
          >
            <div class="flex items-center px-4 py-4 sm:px-6">
              <!-- Selection Checkbox -->
              @if (selectable) {
                <div class="mr-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    [checked]="isSelected(item)"
                    [disabled]="item.disabled"
                    (click)="$event.stopPropagation()"
                    (change)="onSelectionChange(item)"
                    class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
              }

              <!-- Item Content -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <!-- Main Content -->
                  <div class="flex items-center">
                    <!-- Image/Icon -->
                    @if (item.image || item.icon) {
                      <div class="mr-4 flex-shrink-0">
                        @if (item.image) {
                          <img
                            [src]="item.image"
                            [alt]="item.title"
                            class="h-12 w-12 rounded-full object-cover"
                          />
                        } @else if (item.icon) {
                          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <i [class]="item.icon" class="text-gray-500"></i>
                          </div>
                        }
                      </div>
                    }

                    <!-- Text Content -->
                    <div>
                      <div class="font-medium text-gray-900">{{ item.title }}</div>
                      @if (item.subtitle) {
                        <div class="text-sm text-gray-500">{{ item.subtitle }}</div>
                      }
                      @if (item.description) {
                        <div class="mt-2 text-sm text-gray-700">{{ item.description }}</div>
                      }
                      
                      <!-- Metadata -->
                      @if (item.metadata && showMetadata) {
                        <div class="mt-2 flex items-center space-x-4">
                          @for (key of getMetadataKeys(item); track key) {
                            <div class="text-sm text-gray-500">
                              <span class="font-medium">{{ formatMetadataKey(key) }}:</span>
                              <span class="ml-1">{{ item.metadata[key] }}</span>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Badge -->
                  @if (item.badge) {
                    <div class="ml-4">
                      <span 
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        [class]="getBadgeClasses(item.badge.variant)"
                      >
                        {{ item.badge.text }}
                      </span>
                    </div>
                  }
                </div>
              </div>

              <!-- Actions -->
              @if (showActions) {
                <div class="ml-4 flex flex-shrink-0 items-center space-x-2">
                  <ng-content select="[listItemActions]"></ng-content>
                </div>
              }
            </div>
          </li>
        }

        <!-- Empty State -->
        @if (items.length === 0) {
          <li class="px-4 py-8 text-center">
            <div class="text-sm text-gray-500">{{ emptyMessage }}</div>
          </li>
        }
      </ul>
    </div>
  `
})
export class ListComponent {
  @Input() items: ListItem[] = [];
  @Input() selectable = false;
  @Input() showActions = true;
  @Input() showMetadata = true;
  @Input() bordered = true;
  @Input() emptyMessage = 'No items to display';

  @Output() itemClick = new EventEmitter<ListItem>();
  @Output() selectionChange = new EventEmitter<ListItem[]>();

  selectedItems = new Set<string>();

  getItemClasses(item: ListItem): string {
    const baseClasses = 'relative hover:bg-gray-50 transition-colors duration-150';
    const selectedClasses = this.isSelected(item) ? 'bg-primary-50' : '';
    return `${baseClasses} ${selectedClasses}`;
  }

  getBadgeClasses(variant: string = 'primary'): string {
    const variants = {
      primary: 'bg-primary-100 text-primary-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    };
    return variants[variant as keyof typeof variants] || variants.primary;
  }

  onItemClick(item: ListItem): void {
    if (!item.disabled) {
      this.itemClick.emit(item);
    }
  }

  onSelectionChange(item: ListItem): void {
    if (item.disabled) return;

    if (this.isSelected(item)) {
      this.selectedItems.delete(item.id);
    } else {
      this.selectedItems.add(item.id);
    }

    this.selectionChange.emit(
      this.items.filter(i => this.selectedItems.has(i.id))
    );
  }

  isSelected(item: ListItem): boolean {
    return this.selectedItems.has(item.id);
  }

  getMetadataKeys(item: ListItem): string[] {
    return item.metadata ? Object.keys(item.metadata) : [];
  }

  formatMetadataKey(key: string): string {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Helper method to select all items
  selectAll(): void {
    this.items
      .filter(item => !item.disabled)
      .forEach(item => this.selectedItems.add(item.id));
    this.emitSelectionChange();
  }

  // Helper method to deselect all items
  deselectAll(): void {
    this.selectedItems.clear();
    this.emitSelectionChange();
  }

  // Helper method to toggle all selections
  toggleAll(): void {
    if (this.selectedItems.size === this.getSelectableItemsCount()) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  // Helper method to get selectable items count
  getSelectableItemsCount(): number {
    return this.items.filter(item => !item.disabled).length;
  }

  // Helper method to get selected items count
  getSelectedCount(): number {
    return this.selectedItems.size;
  }

  // Helper method to check if all items are selected
  areAllSelected(): boolean {
    return this.getSelectedCount() === this.getSelectableItemsCount();
  }

  // Helper method to emit selection change
  private emitSelectionChange(): void {
    this.selectionChange.emit(
      this.items.filter(item => this.selectedItems.has(item.id))
    );
  }
}