import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold">Dropshipping Store</h3>
            <p class="text-gray-300">
              Your one-stop shop for quality products at competitive prices.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold">Quick Links</h4>
            <ul class="space-y-2">
              <li>
                <a routerLink="/products" 
                   class="text-gray-300 hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a routerLink="/cart" 
                   class="text-gray-300 hover:text-white transition-colors">
                  Cart
                </a>
              </li>
              <li>
                <a routerLink="/profile" 
                   class="text-gray-300 hover:text-white transition-colors">
                  My Account
                </a>
              </li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold">Customer Service</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors">
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold">Newsletter</h4>
            <p class="text-gray-300">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <div class="flex">
              <input
                type="email"
                placeholder="Enter your email"
                class="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button class="bg-primary-600 px-4 py-2 rounded-r-md hover:bg-primary-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {{ currentYear }} Dropshipping Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}