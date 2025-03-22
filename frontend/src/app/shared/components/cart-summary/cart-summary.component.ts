import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { CartSummary } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold mb-4">Order Summary</h2>
      
      <!-- Subtotal -->
      <div class="flex justify-between mb-2">
        <span class="text-gray-600">Subtotal</span>
        <span class="text-gray-900">${{ summary.subtotal.toFixed(2) }}</span>
      </div>

      <!-- Shipping -->
      <div class="flex justify-between mb-2">
        <span class="text-gray-600">Shipping</span>
        @if (summary.shipping > 0) {
          <span class="text-gray-900">${{ summary.shipping.toFixed(2) }}</span>
        } @else {
          <span class="text-green-600">Free</span>
        }
      </div>

      <!-- Tax -->
      <div class="flex justify-between mb-2">
        <span class="text-gray-600">Tax</span>
        <span class="text-gray-900">${{ summary.tax.toFixed(2) }}</span>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200 my-4"></div>

      <!-- Total -->
      <div class="flex justify-between mb-6">
        <span class="text-lg font-semibold">Total</span>
        <div class="text-right">
          <span class="text-lg font-semibold text-gray-900">
            ${{ summary.total.toFixed(2) }}
          </span>
          <p class="text-sm text-gray-500">including VAT</p>
        </div>
      </div>

      <!-- Item Count -->
      <div class="text-sm text-gray-500 mb-6">
        {{ summary.itemCount }} item{{ summary.itemCount !== 1 ? 's' : '' }} in cart
      </div>

      <!-- Checkout Button -->
      @if (showCheckoutButton) {
        <app-button
          [fullWidth]="true"
          [disabled]="summary.itemCount === 0"
          [loading]="loading"
          (buttonClick)="onCheckout()"
        >
          Proceed to Checkout
        </app-button>
      }

      <!-- Continue Shopping -->
      @if (showContinueShopping) {
        <a
          routerLink="/products"
          class="block text-center mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Continue Shopping
        </a>
      }

      <!-- Secure Checkout Message -->
      <div class="mt-6 flex items-center justify-center text-sm text-gray-500">
        <i class="fas fa-lock mr-2"></i>
        <span>Secure Checkout</span>
      </div>

      <!-- Accepted Payment Methods -->
      @if (showPaymentMethods) {
        <div class="mt-4">
          <p class="text-sm text-gray-500 text-center mb-2">We Accept</p>
          <div class="flex justify-center space-x-2">
            <i class="fab fa-cc-visa text-2xl text-gray-400"></i>
            <i class="fab fa-cc-mastercard text-2xl text-gray-400"></i>
            <i class="fab fa-cc-amex text-2xl text-gray-400"></i>
            <i class="fab fa-cc-paypal text-2xl text-gray-400"></i>
          </div>
        </div>
      }

      <!-- Shipping Info -->
      @if (showShippingInfo) {
        <div class="mt-6 text-sm text-gray-500">
          <div class="flex items-center mb-2">
            <i class="fas fa-truck mr-2"></i>
            <span>Free shipping on orders over $50</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-undo mr-2"></i>
            <span>30-day return policy</span>
          </div>
        </div>
      }
    </div>
  `
})
export class CartSummaryComponent {
  @Input() summary: CartSummary = {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    itemCount: 0
  };

  @Input() showCheckoutButton = true;
  @Input() showContinueShopping = true;
  @Input() showPaymentMethods = true;
  @Input() showShippingInfo = true;
  @Input() loading = false;

  @Output() checkout = new EventEmitter<void>();

  onCheckout(): void {
    if (!this.loading && this.summary.itemCount > 0) {
      this.checkout.emit();
    }
  }
}