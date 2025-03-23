import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Main Navigation -->
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="text-2xl font-bold text-primary-600">
                <img src="assets/images/logo.svg" alt="Logo" class="h-8 w-auto">
              </a>
            </div>

            <!-- Main Navigation -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                *ngFor="let item of navigationItems"
                [routerLink]="item.path"
                routerLinkActive="border-primary-500 text-gray-900"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors duration-200"
              >
                {{ item.label }}
              </a>
            </div>
          </div>

          <!-- Right Navigation -->
          <div class="flex items-center">
            <!-- Search -->
            <button
              type="button"
              class="p-2 text-gray-400 hover:text-gray-500"
              (click)="toggleSearch()"
            >
              <i class="fas fa-search text-xl"></i>
            </button>

            <!-- Cart -->
            @if (cartItemCount > 0) {
              <a
                routerLink="/cart"
                class="ml-4 relative p-2 text-gray-400 hover:text-gray-500"
              >
                <i class="fas fa-shopping-cart text-xl"></i>
                <span
                  class="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded-full"
                >
                  {{ cartItemCount }}
                </span>
              </a>
            }

            <!-- Notifications -->
            @if (notificationCount > 0) {
              <button
                type="button"
                class="ml-4 relative p-2 text-gray-400 hover:text-gray-500"
                (click)="toggleNotifications()"
              >
                <i class="fas fa-bell text-xl"></i>
                <span
                  class="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded-full"
                >
                  {{ notificationCount }}
                </span>
              </button>
            }

            <!-- User Menu -->
            @if (user) {
              <div class="ml-4 relative">
                <button
                  type="button"
                  class="flex items-center space-x-2 text-sm focus:outline-none"
                  (click)="toggleUserMenu()"
                >
                  @if (user.avatar) {
                    <img
                      [src]="user.avatar"
                      [alt]="user.firstName"
                      class="h-8 w-8 rounded-full object-cover"
                    >
                  } @else {
                    <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span class="text-sm font-medium text-primary-600">
                        {{ getInitials(user) }}
                      </span>
                    </div>
                  }
                  <span class="hidden md:block text-gray-700">
                    {{ user.firstName }}
                  </span>
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </button>

                <!-- User Dropdown Menu -->
                @if (showUserMenu) {
                  <div
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                  >
                    <div class="py-1">
                      <a
                        routerLink="/profile"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </a>
                      <a
                        routerLink="/orders"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Orders
                      </a>
                      <a
                        routerLink="/settings"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </a>
                    </div>
                    @if (user.role === 'admin') {
                      <div class="py-1">
                        <a
                          routerLink="/admin"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </a>
                      </div>
                    }
                    <div class="py-1">
                      <button
                        type="button"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        (click)="onLogout()"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="ml-4 flex items-center space-x-4">
                <a
                  routerLink="/auth/login"
                  class="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Sign in
                </a>
                <a
                  routerLink="/auth/register"
                  class="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md"
                >
                  Sign up
                </a>
              </div>
            }
          </div>
        </div>
      </nav>

      <!-- Mobile Menu -->
      @if (showMobileMenu) {
        <div class="sm:hidden">
          <div class="pt-2 pb-3 space-y-1">
            @for (item of navigationItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-primary-50 border-primary-500 text-primary-700"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              >
                {{ item.label }}
              </a>
            }
          </div>
        </div>
      }

      <!-- Search Modal -->
      @if (showSearch) {
        <div class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div class="mt-3 text-center sm:mt-5">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                      Search
                    </h3>
                    <div class="mt-2">
                      <input
                        type="text"
                        [(ngModel)]="searchQuery"
                        (keyup.enter)="onSearch()"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Search products..."
                        #searchInput
                      >
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    (click)="onSearch()"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    (click)="toggleSearch()"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </header>
  `
})
export class HeaderComponent {
  @Input() user: User | null = null;
  @Input() cartItemCount = 0;
  @Input() notificationCount = 0;

  @Output() logout = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  showMobileMenu = false;
  showUserMenu = false;
  showSearch = false;
  searchQuery = '';

  navigationItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/products', label: 'Products', exact: false },
    { path: '/categories', label: 'Categories', exact: false },
    { path: '/about', label: 'About', exact: true },
    { path: '/contact', label: 'Contact', exact: true }
  ];

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    this.showUserMenu = false;
    this.showSearch = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showMobileMenu = false;
    this.showSearch = false;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    this.showMobileMenu = false;
    this.showUserMenu = false;
  }

  toggleNotifications(): void {
    // Implement notifications toggle
  }

  onLogout(): void {
    this.logout.emit();
    this.showUserMenu = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery);
      this.showSearch = false;
      this.searchQuery = '';
    }
  }

  getInitials(user: User): string {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
}