import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="container mx-auto px-4 py-24">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8 animate-fade-in">
            <h1 class="text-5xl font-bold leading-tight">
              Discover Amazing Products at Unbeatable Prices
            </h1>
            <p class="text-xl text-primary-100">
              Shop our curated collection of high-quality products. Fast shipping, excellent customer service, and satisfaction guaranteed.
            </p>
            <div class="flex space-x-4">
              <a routerLink="/products" 
                 class="bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-primary-50 transition-colors">
                Shop Now
              </a>
              <a routerLink="/auth/register" 
                 class="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Sign Up
              </a>
            </div>
          </div>
          <div class="hidden md:block animate-slide-in">
            <img src="assets/images/hero-image.png" alt="Shopping" class="w-full rounded-lg shadow-xl">
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="text-primary-600 text-4xl mb-4">
              <i class="fas fa-shipping-fast"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Fast Shipping</h3>
            <p class="text-gray-600">Quick delivery to your doorstep with real-time tracking.</p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="text-primary-600 text-4xl mb-4">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Secure Shopping</h3>
            <p class="text-gray-600">Your transactions are protected with advanced security.</p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="text-primary-600 text-4xl mb-4">
              <i class="fas fa-headset"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">24/7 Support</h3>
            <p class="text-gray-600">Our customer service team is always here to help.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Product cards will be dynamically loaded here -->
          <div *ngFor="let i of [1,2,3,4]" class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="aspect-w-1 aspect-h-1">
              <img src="assets/images/product-placeholder.jpg" alt="Product" class="object-cover">
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">Product Name</h3>
              <p class="text-gray-600 mb-4">$99.99</p>
              <button class="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="bg-primary-50 py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
        <p class="text-gray-600 mb-8">Subscribe to our newsletter for the latest products and exclusive offers.</p>
        <div class="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button class="bg-primary-600 text-white px-8 py-3 rounded-r-md hover:bg-primary-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div *ngFor="let i of [1,2,3]" class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-primary-600 mb-4">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <p class="text-gray-600 mb-4">"Great products and excellent service! Will definitely shop here again."</p>
            <div class="flex items-center">
              <img src="assets/images/avatar-placeholder.jpg" alt="Customer" class="w-10 h-10 rounded-full mr-4">
              <div>
                <h4 class="font-semibold">John Doe</h4>
                <p class="text-gray-500 text-sm">Verified Customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-fade-in {
      animation: fadeIn 1s ease-in;
    }

    .animate-slide-in {
      animation: slideIn 1s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class HomeComponent {}