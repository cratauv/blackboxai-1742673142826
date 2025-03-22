import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center">
      <!-- Decrease Button -->
      <button
        type="button"
        (click)="decrease()"
        [disabled]="quantity <= min || disabled"
        class="w-8 h-8 flex items-center justify-center rounded-l border"
        [class.opacity-50]="quantity <= min || disabled"
        [class.cursor-not-allowed]="quantity <= min || disabled"
        [class.hover:bg-gray-100]="quantity > min && !disabled"
        [class.bg-gray-50]="disabled"
      >
        <i class="fas fa-minus text-gray-600"></i>
      </button>

      <!-- Quantity Input -->
      <input
        type="number"
        [(ngModel)]="quantity"
        (ngModelChange)="onQuantityChange($event)"
        [min]="min"
        [max]="max"
        [disabled]="disabled"
        class="w-16 h-8 text-center border-y focus:outline-none focus:ring-1 focus:ring-primary-500"
        [class.bg-gray-50]="disabled"
      />

      <!-- Increase Button -->
      <button
        type="button"
        (click)="increase()"
        [disabled]="quantity >= max || disabled"
        class="w-8 h-8 flex items-center justify-center rounded-r border"
        [class.opacity-50]="quantity >= max || disabled"
        [class.cursor-not-allowed]="quantity >= max || disabled"
        [class.hover:bg-gray-100]="quantity < max && !disabled"
        [class.bg-gray-50]="disabled"
      >
        <i class="fas fa-plus text-gray-600"></i>
      </button>

      <!-- Stock Warning -->
      @if (showStockWarning && quantity >= stockThreshold && stockCount) {
        <span class="ml-2 text-sm text-orange-500">
          Only {{ stockCount - quantity }} left
        </span>
      }

      <!-- Max Quantity Warning -->
      @if (showMaxWarning && quantity >= max) {
        <span class="ml-2 text-sm text-red-500">
          Max quantity reached
        </span>
      }
    </div>

    <!-- Error Message -->
    @if (errorMessage) {
      <p class="mt-1 text-sm text-red-500">{{ errorMessage }}</p>
    }
  `,
  styles: [`
    /* Hide number input spinners */
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
  `]
})
export class QuantitySelectorComponent {
  @Input() quantity = 1;
  @Input() min = 1;
  @Input() max = 99;
  @Input() disabled = false;
  @Input() showStockWarning = true;
  @Input() showMaxWarning = true;
  @Input() stockCount?: number;
  @Input() stockThreshold = 5;

  @Output() quantityChange = new EventEmitter<number>();

  errorMessage = '';

  increase(): void {
    if (this.quantity < this.max && !this.disabled) {
      this.updateQuantity(this.quantity + 1);
    }
  }

  decrease(): void {
    if (this.quantity > this.min && !this.disabled) {
      this.updateQuantity(this.quantity - 1);
    }
  }

  onQuantityChange(value: number): void {
    this.updateQuantity(value);
  }

  private updateQuantity(value: number): void {
    // Validate input
    if (isNaN(value)) {
      this.errorMessage = 'Please enter a valid number';
      return;
    }

    // Round to nearest integer
    value = Math.round(value);

    // Enforce min/max constraints
    if (value < this.min) {
      value = this.min;
      this.errorMessage = `Minimum quantity is ${this.min}`;
    } else if (value > this.max) {
      value = this.max;
      this.errorMessage = `Maximum quantity is ${this.max}`;
    } else {
      this.errorMessage = '';
    }

    // Check stock availability
    if (this.stockCount !== undefined && value > this.stockCount) {
      value = this.stockCount;
      this.errorMessage = `Only ${this.stockCount} items available`;
    }

    // Update quantity and emit change
    if (this.quantity !== value) {
      this.quantity = value;
      this.quantityChange.emit(value);
    }
  }

  // Helper method to check if at minimum quantity
  isAtMinimum(): boolean {
    return this.quantity <= this.min;
  }

  // Helper method to check if at maximum quantity
  isAtMaximum(): boolean {
    return this.quantity >= this.max;
  }

  // Helper method to check if quantity is low in stock
  isLowStock(): boolean {
    return !!this.stockCount && this.quantity >= this.stockThreshold;
  }
}