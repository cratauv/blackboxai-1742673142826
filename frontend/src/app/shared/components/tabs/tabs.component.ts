import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b border-gray-200">
      <!-- Tab List -->
      <nav class="flex -mb-px space-x-8" role="tablist">
        @for (tab of tabs; track tab.id) {
          <button
            role="tab"
            [id]="'tab-' + tab.id"
            [attr.aria-selected]="activeTab === tab.id"
            [attr.aria-controls]="'panel-' + tab.id"
            [disabled]="tab.disabled"
            (click)="selectTab(tab.id)"
            class="group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            [class.text-primary-600]="activeTab === tab.id"
            [class.border-primary-500]="activeTab === tab.id"
            [class.text-gray-500]="activeTab !== tab.id && !tab.disabled"
            [class.hover:text-gray-700]="activeTab !== tab.id && !tab.disabled"
            [class.text-gray-400]="tab.disabled"
            [class.cursor-not-allowed]="tab.disabled"
          >
            <div class="flex items-center justify-center">
              <!-- Icon -->
              @if (tab.icon) {
                <i [class]="tab.icon" class="mr-2"></i>
              }

              <!-- Label -->
              <span>{{ tab.label }}</span>

              <!-- Badge -->
              @if (tab.badge !== undefined) {
                <span
                  class="ml-2 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-600"
                >
                  {{ tab.badge }}
                </span>
              }
            </div>

            <!-- Active Indicator -->
            <span
              class="absolute inset-x-0 bottom-0 h-0.5"
              [class.bg-primary-500]="activeTab === tab.id"
              aria-hidden="true"
            ></span>
          </button>
        }
      </nav>

      <!-- Tab Panels -->
      <div class="mt-4">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTab = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tabId: string): void {
    if (this.isTabDisabled(tabId)) return;
    
    this.activeTab = tabId;
    this.tabChange.emit(tabId);
  }

  isTabDisabled(tabId: string): boolean {
    const tab = this.tabs.find(t => t.id === tabId);
    return !!tab?.disabled;
  }

  // Helper method to get tab by ID
  getTabById(tabId: string): Tab | undefined {
    return this.tabs.find(tab => tab.id === tabId);
  }

  // Helper method to get tab index
  getTabIndex(tabId: string): number {
    return this.tabs.findIndex(tab => tab.id === tabId);
  }

  // Helper method to get next enabled tab
  getNextEnabledTab(currentTabId: string): Tab | undefined {
    const currentIndex = this.getTabIndex(currentTabId);
    const nextTabs = this.tabs.slice(currentIndex + 1);
    return nextTabs.find(tab => !tab.disabled);
  }

  // Helper method to get previous enabled tab
  getPreviousEnabledTab(currentTabId: string): Tab | undefined {
    const currentIndex = this.getTabIndex(currentTabId);
    const previousTabs = this.tabs.slice(0, currentIndex).reverse();
    return previousTabs.find(tab => !tab.disabled);
  }

  // Helper method to select next tab
  selectNextTab(): void {
    const nextTab = this.getNextEnabledTab(this.activeTab);
    if (nextTab) {
      this.selectTab(nextTab.id);
    }
  }

  // Helper method to select previous tab
  selectPreviousTab(): void {
    const previousTab = this.getPreviousEnabledTab(this.activeTab);
    if (previousTab) {
      this.selectTab(previousTab.id);
    }
  }

  // Helper method to check if tab is active
  isTabActive(tabId: string): boolean {
    return this.activeTab === tabId;
  }

  // Helper method to get active tab data
  getActiveTabData(): Tab | undefined {
    return this.getTabById(this.activeTab);
  }
}

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  template: `
    <div
      role="tabpanel"
      [id]="'panel-' + tabId"
      [attr.aria-labelledby]="'tab-' + tabId"
      [class.hidden]="!active"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class TabPanelComponent {
  @Input() tabId = '';
  @Input() active = false;
}