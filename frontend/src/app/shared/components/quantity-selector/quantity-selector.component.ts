import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inline-flex items-center" [class.opacity-50]="disabled">
      <!-- Decrease Button -->
      <button
        type="button"
        [class]="getButtonClasses('left')"
        [disabled]="isDecrementDisabled()"
        (click)="decrease()"
      >
        <span class="sr-only">Decrease quantity</span>
        <i class="fas fa-minus"></i>
      </button>

      <!-- Input Field -->
      <input
        type="number"
        [class]="getInputClasses()"
        [min]="min"
        [max]="max"
        [step]="step"
        [(ngModel)]="quantity"
        (ngModelChange)="onInputChange($event)"
        (blur)="onBlur()"
        [disabled]="disabled"
      >

      <!-- Increase Button -->
      <button
        type="button"
        [class]="getButtonClasses('right')"
        [disabled]="isIncrementDisabled()"
        (click)="increase()"
      >
        <span class="sr-only">Increase quantity</span>
        <i class="fas fa-plus"></i>
      </button>

      <!-- Stock Warning -->
      @if (showStockWarning && max !== undefined && quantity >= max) {
        <span class="ml-2 text-sm text-warning-600">
          Max stock reached
        </span>
      }
    </div>
  `
})
export class QuantitySelectorComponent {
  @Input() quantity = 1;
  @Input() min = 1;
  @Input() max?: number;
  @Input() step = 1;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() showStockWarning = true;
  @Input() variant: 'default' | 'outline' | 'filled' = 'default';

  @Output() quantityChange = new EventEmitter<number>();
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();

  getButtonClasses(position: 'left' | 'right'): string {
    const baseClasses = 'flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';
    
    const sizeClasses = {
      sm: 'p-1',
      md: 'p-2',
      lg: 'p-3'
    };

    const variantClasses = {
      default: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-600',
      filled: 'bg-primary-600 hover:bg-primary-700 text-white'
    };

    const positionClasses = {
      left: 'rounded-l-md',
      right: 'rounded-r-md'
    };

    const disabledClasses = position === 'left' 
      ? this.isDecrementDisabled() ? 'opacity-50 cursor-not-allowed' : ''
      : this.isIncrementDisabled() ? 'opacity-50 cursor-not-allowed' : '';

    return `
      ${baseClasses}
      ${sizeClasses[this.size]}
      ${variantClasses[this.variant]}
      ${positionClasses[position]}
      ${disabledClasses}
    `;
  }

  getInputClasses(): string {
    const baseClasses = 'block text-center focus:outline-none focus:ring-primary-500 focus:border-primary-500';
    
    const sizeClasses = {
      sm: 'w-12 px-1 py-1 text-sm',
      md: 'w-16 px-2 py-2 text-base',
      lg: 'w-20 px-3 py-3 text-lg'
    };

    const variantClasses = {
      default: 'border-gray-100 bg-gray-100',
      outline: 'border-gray-300 bg-white',
      filled: 'border-primary-600 bg-white'
    };

    return `
      ${baseClasses}
      ${sizeClasses[this.size]}
      ${variantClasses[this.variant]}
    `;
  }

  increase(): void {
    if (!this.isIncrementDisabled()) {
      this.quantity += this.step;
      this.emitChanges();
      this.increment.emit();
    }
  }

  decrease(): void {
    if (!this.isDecrementDisabled()) {
      this.quantity -= this.step;
      this.emitChanges();
      this.decrement.emit();
    }
  }

  onInputChange(value: number): void {
    this.validateAndUpdateQuantity(value);
    this.emitChanges();
  }

  onBlur(): void {
    this.validateAndUpdateQuantity(this.quantity);
    this.emitChanges();
  }

  private validateAndUpdateQuantity(value: number): void {
    let newValue = Math.round(value / this.step) * this.step;
    
    if (this.min !== undefined && newValue < this.min) {
      newValue = this.min;
    }
    
    if (this.max !== undefined && newValue > this.max) {
      newValue = this.max;
    }

    this.quantity = newValue;
  }

  private emitChanges(): void {
    this.quantityChange.emit(this.quantity);
  }

  isDecrementDisabled(): boolean {
    return this.disabled || this.quantity <= this.min;
  }

  isIncrementDisabled(): boolean {
    return this.disabled || (this.max !== undefined && this.quantity >= this.max);
  }

  // Helper method to set quantity
  setQuantity(quantity: number): void {
    this.validateAndUpdateQuantity(quantity);
    this.emitChanges();
  }

  // Helper method to set min value
  setMin(min: number): void {
    this.min = min;
    this.validateAndUpdateQuantity(this.quantity);
    this.emitChanges();
  }

  // Helper method to set max value
  setMax(max: number): void {
    this.max = max;
    this.validateAndUpdateQuantity(this.quantity);
    this.emitChanges();
  }

  // Helper method to set step value
  setStep(step: number): void {
    this.step = step;
    this.validateAndUpdateQuantity(this.quantity);
    this.emitChanges();
  }

  // Helper method to set size
  setSize(size: 'sm' | 'md' | 'lg'): void {
    this.size = size;
  }

  // Helper method to set variant
  setVariant(variant: 'default' | 'outline' | 'filled'): void {
    this.variant = variant;
  }

  // Helper method to enable/disable
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  // Helper method to toggle stock warning
  toggleStockWarning(show: boolean): void {
    this.showStockWarning = show;
  }

  // Helper method to get current quantity
  getQuantity(): number {
    return this.quantity;
  }

  // Helper method to check if at min
  isAtMin(): boolean {
    return this.quantity <= this.min;
  }

  // Helper method to check if at max
  isAtMax(): boolean {
    return this.max !== undefined && this.quantity >= this.max;
  }

  // Helper method to reset to min
  reset(): void {
    this.setQuantity(this.min);
  }
}