import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900">Shopping Cart</h1>

        @if (cartItems.length > 0) {
          <div class="mt-8">
            <div class="flow-root">
              <ul role="list" class="-my-6 divide-y divide-gray-200">
                @for (item of cartItems; track item.id) {
                  <li class="py-6 flex">
                    <!-- Product Image -->
                    <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                      <img
                        [src]="item.image"
                        [alt]="item.name"
                        class="w-full h-full object-center object-cover"
                      />
                    </div>

                    <!-- Product Details -->
                    <div class="ml-4 flex-1 flex flex-col">
                      <div>
                        <div class="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a [routerLink]="['/products', item.id]">{{ item.name }}</a>
                          </h3>
                          <p class="ml-4">{{ item.price * item.quantity | currency }}</p>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
                      </div>
                      <div class="flex-1 flex items-end justify-between text-sm">
                        <!-- Quantity Selector -->
                        <div class="flex items-center">
                          <label class="mr-2 text-gray-500">Qty</label>
                          <div class="flex items-center border border-gray-300 rounded">
                            <button
                              type="button"
                              class="p-2 text-gray-600 hover:text-gray-700"
                              [disabled]="item.quantity <= 1"
                              (click)="updateQuantity(item, -1)"
                            >
                              <i class="fas fa-minus"></i>
                            </button>
                            <input
                              type="number"
                              [value]="item.quantity"
                              (change)="onQuantityChange($event, item)"
                              min="1"
                              [max]="item.stock"
                              class="w-12 text-center border-x border-gray-300"
                            />
                            <button
                              type="button"
                              class="p-2 text-gray-600 hover:text-gray-700"
                              [disabled]="item.quantity >= item.stock"
                              (click)="updateQuantity(item, 1)"
                            >
                              <i class="fas fa-plus"></i>
                            </button>
                          </div>
                          @if (item.quantity >= item.stock) {
                            <span class="ml-2 text-sm text-red-500">Max stock reached</span>
                          }
                        </div>

                        <!-- Remove Button -->
                        <div class="flex">
                          <button
                            type="button"
                            class="font-medium text-primary-600 hover:text-primary-500"
                            (click)="removeItem(item)"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                }
              </ul>
            </div>

            <!-- Cart Summary -->
            <div class="mt-8 bg-gray-50 rounded-lg p-6">
              <h2 class="text-lg font-medium text-gray-900">Order Summary</h2>
              <div class="mt-6 space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600">Subtotal</p>
                  <p class="text-sm font-medium text-gray-900">{{ getSubtotal() | currency }}</p>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600">Shipping</p>
                  <p class="text-sm font-medium text-gray-900">{{ shipping | currency }}</p>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600">Tax</p>
                  <p class="text-sm font-medium text-gray-900">{{ getTax() | currency }}</p>
                </div>
                <div class="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <p class="text-base font-medium text-gray-900">Total</p>
                  <p class="text-base font-medium text-gray-900">{{ getTotal() | currency }}</p>
                </div>
              </div>

              <!-- Promo Code -->
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700">Promo Code</label>
                <div class="mt-1 flex space-x-2">
                  <input
                    type="text"
                    [(ngModel)]="promoCode"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter code"
                  />
                  <button
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    (click)="applyPromoCode()"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <!-- Checkout Button -->
              <div class="mt-6">
                <button
                  type="button"
                  class="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  (click)="checkout()"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        } @else {
          <!-- Empty Cart -->
          <div class="mt-8 text-center">
            <i class="fas fa-shopping-cart text-gray-400 text-5xl"></i>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
            <p class="mt-1 text-sm text-gray-500">
              Start adding some items to your cart
            </p>
            <div class="mt-6">
              <a
                routerLink="/products"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CartComponent {
  cartItems: CartItem[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description for product 1',
      price: 99.99,
      quantity: 1,
      image: 'assets/images/products/1.jpg',
      stock: 10
    },
    // Add more sample items...
  ];

  shipping = 10;
  taxRate = 0.1;
  promoCode = '';

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTax(): number {
    return this.getSubtotal() * this.taxRate;
  }

  getTotal(): number {
    return this.getSubtotal() + this.shipping + this.getTax();
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      item.quantity = newQuantity;
    }
  }

  onQuantityChange(event: Event, item: CartItem): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value) && value >= 1 && value <= item.stock) {
      item.quantity = value;
    } else {
      input.value = item.quantity.toString();
    }
  }

  removeItem(item: CartItem): void {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }

  applyPromoCode(): void {
    // Implement promo code logic
    console.log('Applying promo code:', this.promoCode);
  }

  checkout(): void {
    // Implement checkout logic
    console.log('Proceeding to checkout');
  }
}