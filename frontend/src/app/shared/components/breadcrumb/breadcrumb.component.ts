import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex" aria-label="Breadcrumb">
      <ol role="list" class="flex items-center space-x-4">
        <!-- Home Item -->
        @if (showHome) {
          <li>
            <div>
              <a
                [routerLink]="homeLink"
                class="text-gray-400 hover:text-gray-500"
                [class.cursor-default]="!homeLink"
              >
                <i class="fas fa-home text-lg"></i>
                <span class="sr-only">Home</span>
              </a>
            </div>
          </li>
        }

        <!-- Breadcrumb Items -->
        @for (item of items; track item.label; let first = $first; let last = $last) {
          <li>
            <div class="flex items-center">
              <!-- Separator -->
              @if (!first || showHome) {
                <i
                  [class]="separatorIcon + ' flex-shrink-0 text-gray-300 mx-2'"
                  [style.fontSize]="separatorSize"
                ></i>
              }

              <!-- Item -->
              <a
                [routerLink]="item.link"
                [class]="getItemClasses(last)"
                [class.cursor-default]="!item.link || last"
              >
                @if (item.icon) {
                  <i [class]="item.icon + ' mr-2'"></i>
                }
                {{ item.label }}
              </a>
            </div>
          </li>
        }
      </ol>

      <!-- Actions Slot -->
      @if (showActions) {
        <div class="ml-4 flex items-center space-x-4">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      }
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }

    .truncate-breadcrumb {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (min-width: 640px) {
      .truncate-breadcrumb {
        max-width: 200px;
      }
    }

    @media (min-width: 768px) {
      .truncate-breadcrumb {
        max-width: 300px;
      }
    }
  `]
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() showHome = true;
  @Input() homeLink = '/';
  @Input() showActions = false;
  @Input() separatorIcon = 'fas fa-chevron-right';
  @Input() separatorSize = '12px';
  @Input() truncate = false;

  getItemClasses(isLast: boolean): string {
    const baseClasses = 'text-sm font-medium';
    const activeClasses = isLast
      ? 'text-gray-500'
      : 'text-gray-500 hover:text-gray-700';
    const truncateClass = this.truncate ? 'truncate-breadcrumb' : '';

    return `${baseClasses} ${activeClasses} ${truncateClass}`;
  }

  // Helper method to set items
  setItems(items: BreadcrumbItem[]): void {
    this.items = items;
  }

  // Helper method to add item
  addItem(item: BreadcrumbItem): void {
    this.items.push(item);
  }

  // Helper method to remove last item
  removeLastItem(): void {
    this.items.pop();
  }

  // Helper method to clear items
  clearItems(): void {
    this.items = [];
  }

  // Helper method to update item at index
  updateItem(index: number, item: BreadcrumbItem): void {
    if (index >= 0 && index < this.items.length) {
      this.items[index] = item;
    }
  }

  // Helper method to get current path
  getCurrentPath(): string {
    return this.items.map(item => item.label).join(' / ');
  }

  // Helper method to get last item
  getLastItem(): BreadcrumbItem | undefined {
    return this.items[this.items.length - 1];
  }

  // Helper method to check if has items
  hasItems(): boolean {
    return this.items.length > 0;
  }

  // Helper method to toggle home visibility
  toggleHome(show: boolean): void {
    this.showHome = show;
  }

  // Helper method to set home link
  setHomeLink(link: string): void {
    this.homeLink = link;
  }

  // Helper method to toggle actions visibility
  toggleActions(show: boolean): void {
    this.showActions = show;
  }

  // Helper method to set separator icon
  setSeparatorIcon(icon: string): void {
    this.separatorIcon = icon;
  }

  // Helper method to set separator size
  setSeparatorSize(size: string): void {
    this.separatorSize = size;
  }

  // Helper method to toggle truncate
  toggleTruncate(truncate: boolean): void {
    this.truncate = truncate;
  }

  // Helper method to build items from path
  buildFromPath(path: string, baseUrl = ''): void {
    const segments = path.split('/').filter(segment => segment);
    this.items = segments.map((segment, index) => {
      const link = baseUrl + '/' + segments.slice(0, index + 1).join('/');
      return {
        label: this.formatLabel(segment),
        link
      };
    });
  }

  private formatLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}