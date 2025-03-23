import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="text-2xl font-bold text-primary-600">
            Dropshipping Store
          </a>

          <!-- Navigation Links -->
          <div class="hidden md:flex space-x-8">
            <a routerLink="/products" 
               routerLinkActive="text-primary-600"
               class="text-gray-600 hover:text-primary-500 transition-colors">
              Products
            </a>
            <a routerLink="/cart" 
               routerLinkActive="text-primary-600"
               class="text-gray-600 hover:text-primary-500 transition-colors">
              Cart
            </a>
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center space-x-4">
            <a routerLink="/auth/login" 
               class="text-gray-600 hover:text-primary-500 transition-colors">
              Login
            </a>
            <a routerLink="/auth/register" 
               class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              Register
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button class="md:hidden text-gray-600 hover:text-primary-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu (Hidden by default) -->
        <div class="hidden md:hidden mt-4">
          <div class="flex flex-col space-y-4">
            <a routerLink="/products" 
               routerLinkActive="text-primary-600"
               class="text-gray-600 hover:text-primary-500 transition-colors">
              Products
            </a>
            <a routerLink="/cart" 
               routerLinkActive="text-primary-600"
               class="text-gray-600 hover:text-primary-500 transition-colors">
              Cart
            </a>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {
  // Mobile menu state
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}