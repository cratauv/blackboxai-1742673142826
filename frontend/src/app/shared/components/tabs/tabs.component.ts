import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  routerLink?: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <!-- Tab List -->
      <div class="border-b border-gray-200">
        <nav
          class="-mb-px flex space-x-8"
          [class.overflow-x-auto]="scrollable"
          aria-label="Tabs"
        >
          @for (tab of tabs; track tab.id) {
            <a
              [id]="'tab-' + tab.id"
              [routerLink]="tab.routerLink"
              [class]="getTabClasses(tab)"
              [attr.aria-current]="tab.id === activeTab ? 'page' : undefined"
              [attr.aria-disabled]="tab.disabled"
              (click)="onTabClick(tab)"
            >
              @if (tab.icon) {
                <i [class]="tab.icon + ' -ml-0.5 mr-2 h-5 w-5'"></i>
              }
              {{ tab.label }}
              @if (tab.badge) {
                <span
                  [class]="getBadgeClasses(tab)"
                >
                  {{ tab.badge }}
                </span>
              }
            </a>
          }
        </nav>
      </div>

      <!-- Tab Panels -->
      <div class="mt-4">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .overflow-x-auto {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .overflow-x-auto::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab = '';
  @Input() variant: 'underline' | 'pills' | 'bordered' = 'underline';
  @Input() scrollable = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;

  @Output() tabChange = new EventEmitter<string>();

  getTabClasses(tab: TabItem): string {
    const baseClasses = 'group inline-flex items-center font-medium';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg'
    };

    const variantClasses = {
      underline: this.getUnderlineClasses(tab),
      pills: this.getPillsClasses(tab),
      bordered: this.getBorderedClasses(tab)
    };

    const widthClass = this.fullWidth ? 'flex-1 justify-center' : '';
    const disabledClass = tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${widthClass} ${disabledClass}`;
  }

  private getUnderlineClasses(tab: TabItem): string {
    const isActive = tab.id === this.activeTab;
    return isActive
      ? 'border-b-2 border-primary-500 text-primary-600'
      : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';
  }

  private getPillsClasses(tab: TabItem): string {
    const isActive = tab.id === this.activeTab;
    return isActive
      ? 'bg-primary-100 text-primary-700'
      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50';
  }

  private getBorderedClasses(tab: TabItem): string {
    const isActive = tab.id === this.activeTab;
    return isActive
      ? 'bg-white border-gray-200 border-b-white text-primary-600'
      : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-700';
  }

  getBadgeClasses(tab: TabItem): string {
    const baseClasses = 'ml-2 px-2 py-0.5 text-xs font-medium rounded-full';
    const isActive = tab.id === this.activeTab;

    return isActive
      ? 'bg-primary-100 text-primary-700'
      : 'bg-gray-100 text-gray-600';
  }

  onTabClick(tab: TabItem): void {
    if (!tab.disabled && tab.id !== this.activeTab) {
      this.activeTab = tab.id;
      this.tabChange.emit(tab.id);
    }
  }

  // Helper method to set active tab
  setActiveTab(tabId: string): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      this.activeTab = tabId;
      this.tabChange.emit(tabId);
    }
  }

  // Helper method to add tab
  addTab(tab: TabItem): void {
    this.tabs.push(tab);
  }

  // Helper method to remove tab
  removeTab(tabId: string): void {
    const index = this.tabs.findIndex(t => t.id === tabId);
    if (index !== -1) {
      this.tabs.splice(index, 1);
      if (this.activeTab === tabId) {
        this.activeTab = this.tabs[0]?.id || '';
      }
    }
  }

  // Helper method to enable tab
  enableTab(tabId: string): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.disabled = false;
    }
  }

  // Helper method to disable tab
  disableTab(tabId: string): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.disabled = true;
      if (this.activeTab === tabId) {
        this.activeTab = this.tabs.find(t => !t.disabled)?.id || '';
      }
    }
  }

  // Helper method to update tab badge
  updateBadge(tabId: string, badge: string | number): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.badge = badge;
    }
  }

  // Helper method to clear tab badge
  clearBadge(tabId: string): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.badge = undefined;
    }
  }

  // Helper method to get active tab
  getActiveTab(): TabItem | undefined {
    return this.tabs.find(t => t.id === this.activeTab);
  }

  // Helper method to get next tab
  getNextTab(): TabItem | undefined {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    return this.tabs[currentIndex + 1];
  }

  // Helper method to get previous tab
  getPreviousTab(): TabItem | undefined {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    return this.tabs[currentIndex - 1];
  }

  // Helper method to set variant
  setVariant(variant: 'underline' | 'pills' | 'bordered'): void {
    this.variant = variant;
  }

  // Helper method to set size
  setSize(size: 'sm' | 'md' | 'lg'): void {
    this.size = size;
  }

  // Helper method to toggle scrollable
  toggleScrollable(scrollable: boolean): void {
    this.scrollable = scrollable;
  }

  // Helper method to toggle full width
  toggleFullWidth(fullWidth: boolean): void {
    this.fullWidth = fullWidth;
  }
}