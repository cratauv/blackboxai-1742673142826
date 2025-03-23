import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownItem {
  id: string | number;
  label: string;
  value: any;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block text-left">
      <!-- Trigger Button -->
      <button
        type="button"
        [class]="getTriggerClasses()"
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isOpen"
        [attr.aria-haspopup]="true"
      >
        <!-- Selected Item Icon -->
        @if (selectedItem?.icon) {
          <i [class]="selectedItem.icon + ' mr-2'"></i>
        }

        <!-- Label -->
        <span>{{ selectedItem?.label || placeholder }}</span>

        <!-- Chevron Icon -->
        <i
          class="fas fa-chevron-down ml-2 transition-transform duration-200"
          [class.rotate-180]="isOpen"
        ></i>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen) {
        <div
          class="absolute z-50 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          [class]="getMenuPositionClasses()"
          role="menu"
          aria-orientation="vertical"
          [attr.aria-labelledby]="id"
        >
          <div class="py-1" role="none">
            @for (item of items; track item.id) {
              @if (item.divider) {
                <div class="my-1 border-t border-gray-100"></div>
              } @else {
                <button
                  type="button"
                  class="group flex w-full items-center px-4 py-2 text-sm"
                  [class]="getItemClasses(item)"
                  [disabled]="item.disabled"
                  (click)="onItemClick(item)"
                  role="menuitem"
                >
                  @if (item.icon) {
                    <i [class]="item.icon + ' mr-3 text-gray-400 group-hover:text-gray-500'"></i>
                  }
                  {{ item.label }}

                  @if (item.children) {
                    <i class="fas fa-chevron-right ml-auto"></i>
                  }
                </button>

                @if (item.children && expandedItems.includes(item.id)) {
                  <div class="pl-4">
                    @for (child of item.children; track child.id) {
                      <button
                        type="button"
                        class="group flex w-full items-center px-4 py-2 text-sm"
                        [class]="getItemClasses(child)"
                        [disabled]="child.disabled"
                        (click)="onItemClick(child)"
                        role="menuitem"
                      >
                        @if (child.icon) {
                          <i [class]="child.icon + ' mr-3 text-gray-400 group-hover:text-gray-500'"></i>
                        }
                        {{ child.label }}
                      </button>
                    }
                  </div>
                }
              }
            }
          </div>
        </div>
      }
    </div>
  `
})
export class DropdownComponent {
  @Input() id = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
  @Input() items: DropdownItem[] = [];
  @Input() placeholder = 'Select an option';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() position: 'left' | 'right' = 'left';
  @Input() width: 'auto' | 'full' = 'auto';
  @Input() disabled = false;

  @Output() itemSelected = new EventEmitter<DropdownItem>();

  isOpen = false;
  selectedItem: DropdownItem | null = null;
  expandedItems: (string | number)[] = [];

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.closeDropdown();
  }

  getTriggerClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-2.5 text-lg'
    };

    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500'
    };

    const classes = [
      baseClasses,
      sizeClasses[this.size],
      variantClasses[this.variant],
      'rounded-md',
      this.width === 'full' ? 'w-full' : '',
      this.disabled ? 'opacity-50 cursor-not-allowed' : ''
    ];

    return classes.filter(Boolean).join(' ');
  }

  getMenuPositionClasses(): string {
    const positionClasses = {
      left: 'left-0',
      right: 'right-0'
    };

    return `${positionClasses[this.position]} ${this.width === 'full' ? 'w-full' : 'w-56'}`;
  }

  getItemClasses(item: DropdownItem): string {
    return `
      ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${item === this.selectedItem ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
    `;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.expandedItems = [];
  }

  onItemClick(item: DropdownItem): void {
    if (item.disabled) return;

    if (item.children) {
      this.toggleExpandedItem(item.id);
    } else {
      this.selectedItem = item;
      this.itemSelected.emit(item);
      this.closeDropdown();
    }
  }

  toggleExpandedItem(itemId: string | number): void {
    const index = this.expandedItems.indexOf(itemId);
    if (index === -1) {
      this.expandedItems.push(itemId);
    } else {
      this.expandedItems.splice(index, 1);
    }
  }

  // Helper method to set items
  setItems(items: DropdownItem[]): void {
    this.items = items;
  }

  // Helper method to set selected item
  setSelectedItem(item: DropdownItem): void {
    this.selectedItem = item;
  }

  // Helper method to clear selection
  clearSelection(): void {
    this.selectedItem = null;
  }

  // Helper method to set disabled state
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  // Helper method to set width
  setWidth(width: 'auto' | 'full'): void {
    this.width = width;
  }

  // Helper method to set position
  setPosition(position: 'left' | 'right'): void {
    this.position = position;
  }

  // Helper method to set variant
  setVariant(variant: 'primary' | 'secondary' | 'outline'): void {
    this.variant = variant;
  }

  // Helper method to set size
  setSize(size: 'sm' | 'md' | 'lg'): void {
    this.size = size;
  }

  // Helper method to get selected value
  getSelectedValue(): any {
    return this.selectedItem?.value;
  }

  // Helper method to select item by value
  selectByValue(value: any): void {
    const item = this.findItemByValue(this.items, value);
    if (item) {
      this.selectedItem = item;
    }
  }

  private findItemByValue(items: DropdownItem[], value: any): DropdownItem | null {
    for (const item of items) {
      if (item.value === value) return item;
      if (item.children) {
        const found = this.findItemByValue(item.children, value);
        if (found) return found;
      }
    }
    return null;
  }
}