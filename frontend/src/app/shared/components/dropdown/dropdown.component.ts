import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  danger?: boolean;
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
      <div>
        <button
          type="button"
          (click)="toggle()"
          [class]="getTriggerClasses()"
          [attr.aria-expanded]="isOpen"
          [attr.aria-haspopup]="true"
        >
          @if (icon) {
            <i [class]="icon" class="mr-2"></i>
          }
          
          {{ label }}
          
          <i 
            class="fas fa-chevron-down ml-2 transition-transform duration-200"
            [class.rotate-180]="isOpen"
          ></i>
        </button>
      </div>

      <!-- Dropdown Menu -->
      @if (isOpen) {
        <div
          class="absolute right-0 z-50 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          [class.w-56]="width === 'default'"
          [class.w-72]="width === 'wide'"
          [@dropdownAnimation]
          role="menu"
          aria-orientation="vertical"
          [attr.aria-labelledby]="'dropdown-button-' + id"
        >
          <div class="py-1" role="none">
            @for (item of items; track item.id) {
              @if (item.divider) {
                <div class="my-1 h-px bg-gray-200" role="separator"></div>
              } @else {
                <button
                  type="button"
                  (click)="onItemClick(item)"
                  class="group flex w-full items-center px-4 py-2 text-sm"
                  [class]="getItemClasses(item)"
                  [disabled]="item.disabled"
                  role="menuitem"
                >
                  @if (item.icon) {
                    <i [class]="item.icon" class="mr-3 text-gray-400 group-hover:text-gray-500"></i>
                  }
                  
                  {{ item.label }}
                  
                  @if (item.children) {
                    <i class="fas fa-chevron-right ml-auto"></i>
                  }
                </button>

                @if (item.children && activeSubmenu === item.id) {
                  <div 
                    class="absolute left-full top-0 ml-1 w-56"
                    [@submenuAnimation]
                  >
                    <div class="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div class="py-1">
                        @for (child of item.children; track child.id) {
                          <button
                            type="button"
                            (click)="onItemClick(child)"
                            class="group flex w-full items-center px-4 py-2 text-sm"
                            [class]="getItemClasses(child)"
                            [disabled]="child.disabled"
                            role="menuitem"
                          >
                            @if (child.icon) {
                              <i [class]="child.icon" class="mr-3 text-gray-400 group-hover:text-gray-500"></i>
                            }
                            {{ child.label }}
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                }
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('75ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('submenuAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('75ms ease-in', style({ opacity: 0, transform: 'translateX(-10px)' }))
      ])
    ])
  ]
})
export class DropdownComponent {
  @Input() id = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
  @Input() items: DropdownItem[] = [];
  @Input() label = 'Options';
  @Input() icon?: string;
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() width: 'default' | 'wide' = 'default';
  @Input() placement: 'bottom-start' | 'bottom-end' = 'bottom-end';

  @Output() itemClick = new EventEmitter<DropdownItem>();

  isOpen = false;
  activeSubmenu: string | null = null;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.close();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.activeSubmenu = null;
    }
  }

  close(): void {
    this.isOpen = false;
    this.activeSubmenu = null;
  }

  onItemClick(item: DropdownItem): void {
    if (item.disabled) return;

    if (item.children) {
      this.activeSubmenu = this.activeSubmenu === item.id ? null : item.id;
    } else {
      this.itemClick.emit(item);
      this.close();
    }
  }

  getTriggerClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} rounded-md`;
  }

  getItemClasses(item: DropdownItem): string {
    const baseClasses = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';
    const disabledClasses = 'opacity-50 cursor-not-allowed';
    const dangerClasses = 'text-red-700 hover:bg-red-50 hover:text-red-900';

    if (item.disabled) {
      return `${baseClasses} ${disabledClasses}`;
    }

    return item.danger ? dangerClasses : baseClasses;
  }

  // Helper method to check if item has children
  hasChildren(item: DropdownItem): boolean {
    return !!item.children && item.children.length > 0;
  }

  // Helper method to check if item is active
  isItemActive(item: DropdownItem): boolean {
    return this.activeSubmenu === item.id;
  }

  // Helper method to get nested level
  getNestedLevel(item: DropdownItem, level = 0): number {
    if (!item.children) return level;
    return Math.max(...item.children.map(child => this.getNestedLevel(child, level + 1)));
  }
}