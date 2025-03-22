import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: {
    text: string;
    variant?: 'primary' | 'success' | 'warning' | 'danger';
  };
  divider?: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="space-y-1">
      @for (item of items; track item.id) {
        @if (item.divider) {
          <div class="my-2 border-t border-gray-200"></div>
        } @else {
          <!-- Menu Item -->
          <div class="relative">
            @if (item.route) {
              <!-- Router Link Item -->
              <a
                [routerLink]="item.route"
                routerLinkActive="bg-gray-100 text-gray-900"
                [class]="getItemClasses(item)"
                [class.cursor-not-allowed]="item.disabled"
                [attr.aria-disabled]="item.disabled"
              >
                <div class="flex items-center">
                  @if (item.icon) {
                    <i [class]="item.icon" class="mr-3 text-gray-400 group-hover:text-gray-500"></i>
                  }
                  <span class="truncate">{{ item.label }}</span>
                  @if (item.badge) {
                    <span 
                      class="ml-auto inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                      [class]="getBadgeClasses(item.badge.variant)"
                    >
                      {{ item.badge.text }}
                    </span>
                  }
                  @if (item.children) {
                    <i 
                      class="fas fa-chevron-right ml-auto text-gray-400 transition-transform"
                      [class.rotate-90]="isExpanded(item)"
                    ></i>
                  }
                </div>
              </a>
            } @else {
              <!-- Button Item -->
              <button
                type="button"
                (click)="onItemClick(item)"
                [class]="getItemClasses(item)"
                [disabled]="item.disabled"
                [attr.aria-expanded]="item.children ? isExpanded(item) : undefined"
              >
                <div class="flex items-center">
                  @if (item.icon) {
                    <i [class]="item.icon" class="mr-3 text-gray-400 group-hover:text-gray-500"></i>
                  }
                  <span class="truncate">{{ item.label }}</span>
                  @if (item.badge) {
                    <span 
                      class="ml-auto inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                      [class]="getBadgeClasses(item.badge.variant)"
                    >
                      {{ item.badge.text }}
                    </span>
                  }
                  @if (item.children) {
                    <i 
                      class="fas fa-chevron-right ml-auto text-gray-400 transition-transform"
                      [class.rotate-90]="isExpanded(item)"
                    ></i>
                  }
                </div>
              </button>
            }

            <!-- Nested Menu -->
            @if (item.children && isExpanded(item)) {
              <div class="mt-1 ml-4 space-y-1">
                @for (child of item.children; track child.id) {
                  @if (child.route) {
                    <a
                      [routerLink]="child.route"
                      routerLinkActive="bg-gray-100 text-gray-900"
                      [class]="getItemClasses(child)"
                      [class.cursor-not-allowed]="child.disabled"
                    >
                      <div class="flex items-center">
                        @if (child.icon) {
                          <i [class]="child.icon" class="mr-3 text-gray-400 group-hover:text-gray-500"></i>
                        }
                        <span class="truncate">{{ child.label }}</span>
                        @if (child.badge) {
                          <span 
                            class="ml-auto inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                            [class]="getBadgeClasses(child.badge.variant)"
                          >
                            {{ child.badge.text }}
                          </span>
                        }
                      </div>
                    </a>
                  } @else {
                    <button
                      type="button"
                      (click)="onItemClick(child)"
                      [class]="getItemClasses(child)"
                      [disabled]="child.disabled"
                    >
                      <div class="flex items-center">
                        @if (child.icon) {
                          <i [class]="child.icon" class="mr-3 text-gray-400 group-hover:text-gray-500"></i>
                        }
                        <span class="truncate">{{ child.label }}</span>
                        @if (child.badge) {
                          <span 
                            class="ml-auto inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                            [class]="getBadgeClasses(child.badge.variant)"
                          >
                            {{ child.badge.text }}
                          </span>
                        }
                      </div>
                    </button>
                  }
                }
              </div>
            }
          </div>
        }
      }
    </nav>
  `
})
export class MenuComponent {
  @Input() items: MenuItem[] = [];
  @Output() itemClick = new EventEmitter<MenuItem>();

  expandedItems = new Set<string>();

  getItemClasses(item: MenuItem): string {
    return `
      group flex w-full items-center px-3 py-2 text-sm font-medium rounded-md
      ${item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
      ${item.children ? 'cursor-pointer' : ''}
    `.trim();
  }

  getBadgeClasses(variant: string = 'primary'): string {
    const variants = {
      primary: 'bg-primary-100 text-primary-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800'
    };
    return variants[variant as keyof typeof variants] || variants.primary;
  }

  onItemClick(item: MenuItem): void {
    if (item.disabled) return;

    if (item.children) {
      this.toggleExpanded(item);
    } else {
      this.itemClick.emit(item);
    }
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems.has(item.id);
  }

  toggleExpanded(item: MenuItem): void {
    if (this.expandedItems.has(item.id)) {
      this.expandedItems.delete(item.id);
    } else {
      this.expandedItems.add(item.id);
    }
  }

  // Helper method to expand all items
  expandAll(): void {
    this.items.forEach(item => {
      if (item.children) {
        this.expandedItems.add(item.id);
      }
    });
  }

  // Helper method to collapse all items
  collapseAll(): void {
    this.expandedItems.clear();
  }

  // Helper method to get all active routes
  getActiveRoutes(): string[] {
    const active: string[] = [];
    const findActive = (items: MenuItem[]) => {
      items.forEach(item => {
        if (item.route && this.isRouteActive(item.route)) {
          active.push(item.route);
        }
        if (item.children) {
          findActive(item.children);
        }
      });
    };
    findActive(this.items);
    return active;
  }

  // Helper method to check if route is active
  private isRouteActive(route: string): boolean {
    // This would need to be implemented based on your routing setup
    return window.location.pathname.startsWith(route);
  }

  // Helper method to find item by id
  findItemById(id: string): MenuItem | undefined {
    const find = (items: MenuItem[]): MenuItem | undefined => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = find(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return find(this.items);
  }

  // Helper method to get parent item
  getParentItem(id: string): MenuItem | undefined {
    const find = (items: MenuItem[], parent?: MenuItem): MenuItem | undefined => {
      for (const item of items) {
        if (item.id === id) return parent;
        if (item.children) {
          const found = find(item.children, item);
          if (found) return found;
        }
      }
      return undefined;
    };
    return find(this.items);
  }
}