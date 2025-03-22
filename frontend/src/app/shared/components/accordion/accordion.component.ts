import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  disabled?: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      @for (item of items; track item.id) {
        <div class="group">
          <!-- Accordion Header -->
          <button
            type="button"
            (click)="toggleItem(item)"
            class="flex w-full items-center justify-between px-4 py-5 sm:p-6"
            [class.cursor-not-allowed]="item.disabled"
            [class.opacity-50]="item.disabled"
            [attr.aria-expanded]="isExpanded(item)"
            [disabled]="item.disabled"
          >
            <div class="flex items-center">
              @if (item.icon) {
                <i 
                  [class]="item.icon"
                  class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                ></i>
              }
              
              <span 
                class="text-left text-gray-900"
                [class.font-medium]="isExpanded(item)"
              >
                {{ item.title }}
              </span>
            </div>
            
            <i 
              class="fas fa-chevron-down ml-4 h-5 w-5 text-gray-400 transition-transform duration-200"
              [class.rotate-180]="isExpanded(item)"
            ></i>
          </button>

          <!-- Accordion Content -->
          <div
            class="overflow-hidden"
            [@expandCollapse]="isExpanded(item) ? 'expanded' : 'collapsed'"
          >
            <div class="px-4 pb-5 pt-0 sm:px-6 sm:pb-6">
              @if (useMarkdown) {
                <div [innerHTML]="item.content"></div>
              } @else {
                <p class="text-gray-700">{{ item.content }}</p>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('200ms ease-out')
      ])
    ])
  ],
  styles: [`
    :host {
      display: block;
    }

    .group:first-child {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }

    .group:last-child {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
  `]
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() allowMultiple = false;
  @Input() useMarkdown = false;
  @Input() expandFirst = false;
  @Input() animated = true;

  expandedItems = new Set<string>();

  ngOnInit(): void {
    if (this.expandFirst && this.items.length > 0) {
      this.expandedItems.add(this.items[0].id);
    }

    // Initialize with any pre-expanded items
    this.items.forEach(item => {
      if (item.expanded) {
        this.expandedItems.add(item.id);
      }
    });
  }

  toggleItem(item: AccordionItem): void {
    if (item.disabled) return;

    if (this.isExpanded(item)) {
      this.expandedItems.delete(item.id);
    } else {
      if (!this.allowMultiple) {
        this.expandedItems.clear();
      }
      this.expandedItems.add(item.id);
    }
  }

  isExpanded(item: AccordionItem): boolean {
    return this.expandedItems.has(item.id);
  }

  // Helper method to expand all items
  expandAll(): void {
    if (!this.allowMultiple) return;
    this.items.forEach(item => {
      if (!item.disabled) {
        this.expandedItems.add(item.id);
      }
    });
  }

  // Helper method to collapse all items
  collapseAll(): void {
    this.expandedItems.clear();
  }

  // Helper method to get expanded items count
  getExpandedCount(): number {
    return this.expandedItems.size;
  }

  // Helper method to check if any item is expanded
  hasExpandedItems(): boolean {
    return this.expandedItems.size > 0;
  }

  // Helper method to get item by ID
  getItemById(id: string): AccordionItem | undefined {
    return this.items.find(item => item.id === id);
  }

  // Helper method to expand specific item
  expandItem(id: string): void {
    const item = this.getItemById(id);
    if (item && !item.disabled) {
      if (!this.allowMultiple) {
        this.expandedItems.clear();
      }
      this.expandedItems.add(id);
    }
  }

  // Helper method to collapse specific item
  collapseItem(id: string): void {
    this.expandedItems.delete(id);
  }

  // Helper method to toggle specific item
  toggleItemById(id: string): void {
    const item = this.getItemById(id);
    if (item) {
      this.toggleItem(item);
    }
  }
}