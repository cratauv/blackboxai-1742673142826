import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface CheckoutStep {
  id: string;
  name: string;
  completed: boolean;
  current: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Steps -->
        <nav aria-label="Progress">
          <ol role="list" class="flex items-center">
            @for (step of steps; track step.id; let first = $first; let last = $last) {
              <li class="relative" [class.flex-1]="!last">
                @if (!first) {
                  <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="h-0.5 w-full" [class]="step.completed ? 'bg-primary-600' : 'bg-gray-200'"></div>
                  </div>
                }
                <div
                  class="relative flex items-center justify-center"
                  [class]="step.completed ? 'hover:cursor-pointer' : ''"
                  (click)="step.completed ? goToStep(step) : null"
                >
                  @if (step.completed) {
                    <span class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <i class="fas fa-check text-white"></i>
                    </span>
                  } @else if (step.current) {
                    <span class="h-8 w-8 rounded-full border-2 border-primary-600 flex items-center justify-center">
                      <span class="text-primary-600">{{ steps.indexOf(step) + 1 }}</span>
                    </span>
                  } @else {
                    <span class="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <span class="text-gray-500">{{ steps.indexOf(step) + 1 }}</span>
                    </span>
                  }
                  <span
                    class="absolute top-10 text-sm font-medium"
                    [class]="step.current ? 'text-primary-600' : 'text-gray-500'"
                  >
                    {{ step.name }}
                  </span>
                </div>
              </li>
            }
          </ol>
        </nav>

        <!-- Shipping Information -->
        @if (currentStep === 'shipping') {
          <div class="mt-12">
            <h2 class="text-lg font-medium text-gray-900">Shipping Information</h2>
            <div class="mt-6">
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    [(ngModel)]="shippingInfo.firstName"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    [(ngModel)]="shippingInfo.lastName"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    [(ngModel)]="shippingInfo.address"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    [(ngModel)]="shippingInfo.city"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    [(ngModel)]="shippingInfo.state"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    [(ngModel)]="shippingInfo.zip"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    [(ngModel)]="shippingInfo.phone"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <!-- Shipping Methods -->
              <div class="mt-8">
                <h3 class="text-lg font-medium text-gray-900">Shipping Method</h3>
                <div class="mt-4 space-y-4">
                  @for (method of shippingMethods; track method.id) {
                    <div class="relative flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-500">
                      <input
                        type="radio"
                        [id]="method.id"
                        [value]="method.id"
                        [(ngModel)]="selectedShippingMethod"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label [for]="method.id" class="ml-3 flex flex-col cursor-pointer">
                        <span class="block text-sm font-medium text-gray-900">{{ method.name }}</span>
                        <span class="block text-sm text-gray-500">{{ method.description }}</span>
                        <span class="block text-sm text-gray-500">{{ method.estimatedDays }}</span>
                      </label>
                      <span class="ml-auto text-sm font-medium text-gray-900">
                        {{ method.price | currency }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Payment Information -->
        @if (currentStep === 'payment') {
          <div class="mt-12">
            <h2 class="text-lg font-medium text-gray-900">Payment Information</h2>
            <div class="mt-6">
              <!-- Payment Methods -->
              <div class="space-y-4">
                @for (method of paymentMethods; track method.id) {
                  <div class="relative flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-500">
                    <input
                      type="radio"
                      [id]="method.id"
                      [value]="method.id"
                      [(ngModel)]="selectedPaymentMethod"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label [for]="method.id" class="ml-3 flex items-center cursor-pointer">
                      <i [class]="method.icon + ' text-xl mr-2'"></i>
                      <span class="text-sm font-medium text-gray-900">{{ method.name }}</span>
                    </label>
                  </div>
                }
              </div>

              <!-- Card Details -->
              @if (selectedPaymentMethod === 'card') {
                <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      [(ngModel)]="cardDetails.number"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Expiration Date</label>
                    <input
                      type="text"
                      [(ngModel)]="cardDetails.expiry"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      [(ngModel)]="cardDetails.cvv"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="123"
                    />
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Review Order -->
        @if (currentStep === 'review') {
          <div class="mt-12">
            <h2 class="text-lg font-medium text-gray-900">Review Order</h2>
            <div class="mt-6">
              <!-- Order Summary -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-base font-medium text-gray-900">Order Summary</h3>
                <dl class="mt-4 space-y-4">
                  <div class="flex items-center justify-between">
                    <dt class="text-sm text-gray-600">Subtotal</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ subtotal | currency }}</dd>
                  </div>
                  <div class="flex items-center justify-between">
                    <dt class="text-sm text-gray-600">Shipping</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ shipping | currency }}</dd>
                  </div>
                  <div class="flex items-center justify-between">
                    <dt class="text-sm text-gray-600">Tax</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ tax | currency }}</dd>
                  </div>
                  <div class="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <dt class="text-base font-medium text-gray-900">Total</dt>
                    <dd class="text-base font-medium text-gray-900">{{ total | currency }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        }

        <!-- Navigation Buttons -->
        <div class="mt-8 flex justify-between">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            [class.invisible]="isFirstStep()"
            (click)="previousStep()"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Previous
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            (click)="nextStep()"
          >
            @if (isLastStep()) {
              Place Order
            } @else {
              Next
              <i class="fas fa-arrow-right ml-2"></i>
            }
          </button>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  steps: CheckoutStep[] = [
    { id: 'shipping', name: 'Shipping', completed: false, current: true },
    { id: 'payment', name: 'Payment', completed: false, current: false },
    { id: 'review', name: 'Review', completed: false, current: false }
  ];

  currentStep = 'shipping';

  shippingInfo = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  };

  shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Standard ground shipping',
      price: 5.99,
      estimatedDays: '5-7 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Expedited shipping',
      price: 14.99,
      estimatedDays: '2-3 business days'
    }
  ];

  selectedShippingMethod = 'standard';

  paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Credit Card', icon: 'fas fa-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal' }
  ];

  selectedPaymentMethod = 'card';

  cardDetails = {
    number: '',
    expiry: '',
    cvv: ''
  };

  subtotal = 99.99;
  shipping = 5.99;
  tax = 10.00;
  total = 115.98;

  isFirstStep(): boolean {
    return this.currentStep === this.steps[0].id;
  }

  isLastStep(): boolean {
    return this.currentStep === this.steps[this.steps.length - 1].id;
  }

  getCurrentStepIndex(): number {
    return this.steps.findIndex(step => step.id === this.currentStep);
  }

  goToStep(step: CheckoutStep): void {
    if (step.completed) {
      this.currentStep = step.id;
      this.updateSteps();
    }
  }

  previousStep(): void {
    const currentIndex = this.getCurrentStepIndex();
    if (currentIndex > 0) {
      this.currentStep = this.steps[currentIndex - 1].id;
      this.updateSteps();
    }
  }

  nextStep(): void {
    const currentIndex = this.getCurrentStepIndex();
    if (this.isLastStep()) {
      this.placeOrder();
    } else if (currentIndex < this.steps.length - 1) {
      this.steps[currentIndex].completed = true;
      this.currentStep = this.steps[currentIndex + 1].id;
      this.updateSteps();
    }
  }

  updateSteps(): void {
    const currentIndex = this.getCurrentStepIndex();
    this.steps.forEach((step, index) => {
      step.current = index === currentIndex;
    });
  }

  placeOrder(): void {
    // Implement order placement logic
    console.log('Placing order...');
  }
}