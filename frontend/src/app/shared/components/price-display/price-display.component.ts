import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-baseline" [class.line-through]="isStrikethrough">
      <!-- Currency Symbol -->
      @if (showCurrencySymbol) {
        <span 
          class="text-sm mr-1"
          [class.text-gray-500]="isSecondary"
          [class.font-normal]="!isBold"
        >
          {{ currencySymbol }}
        </span>
      }

      <!-- Main Price -->
      <span
        [class.text-gray-500]="isSecondary"
        [class.font-bold]="isBold"
        [class.text-xl]="size === 'lg'"
        [class.text-base]="size === 'md'"
        [class.text-sm]="size === 'sm'"
      >
        {{ formatPrice(price) }}
      </span>

      <!-- Decimal Part -->
      @if (showDecimals && getDecimalPart(price) !== '00') {
        <span
          class="text-sm"
          [class.text-gray-500]="isSecondary"
          [class.font-normal]="!isBold"
        >
          .{{ getDecimalPart(price) }}
        </span>
      }

      <!-- Currency Code -->
      @if (showCurrencyCode) {
        <span class="ml-1 text-sm text-gray-500">
          {{ currencyCode }}
        </span>
      }
    </div>

    <!-- Discount Tag -->
    @if (showDiscount && originalPrice && originalPrice > price) {
      <div class="inline-flex items-center ml-2">
        <span 
          class="text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded"
        >
          Save {{ calculateDiscountPercentage() }}%
        </span>
      </div>
    }

    <!-- Original Price -->
    @if (showOriginalPrice && originalPrice && originalPrice > price) {
      <div class="text-sm text-gray-500 line-through mt-1">
        {{ currencySymbol }}{{ formatPrice(originalPrice) }}
      </div>
    }
  `
})
export class PriceDisplayComponent {
  @Input() price = 0;
  @Input() originalPrice?: number;
  @Input() currencySymbol = '$';
  @Input() currencyCode = 'USD';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showCurrencySymbol = true;
  @Input() showCurrencyCode = false;
  @Input() showDecimals = true;
  @Input() showDiscount = false;
  @Input() showOriginalPrice = false;
  @Input() isStrikethrough = false;
  @Input() isSecondary = false;
  @Input() isBold = true;

  formatPrice(price: number): string {
    return Math.floor(price).toString();
  }

  getDecimalPart(price: number): string {
    const decimal = Math.round((price % 1) * 100);
    return decimal.toString().padStart(2, '0');
  }

  calculateDiscountPercentage(): number {
    if (!this.originalPrice || this.originalPrice <= this.price) return 0;
    const discount = ((this.originalPrice - this.price) / this.originalPrice) * 100;
    return Math.round(discount);
  }

  // Helper method to format price with locale
  formatWithLocale(price: number, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currencyCode,
      minimumFractionDigits: this.showDecimals ? 2 : 0,
      maximumFractionDigits: this.showDecimals ? 2 : 0
    }).format(price);
  }

  // Helper method to check if price is free
  isFree(): boolean {
    return this.price === 0;
  }

  // Helper method to check if price has discount
  hasDiscount(): boolean {
    return !!this.originalPrice && this.originalPrice > this.price;
  }

  // Helper method to get discount amount
  getDiscountAmount(): number {
    if (!this.originalPrice) return 0;
    return this.originalPrice - this.price;
  }

  // Helper method to format large numbers with K/M suffix
  formatLargeNumber(price: number): string {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}K`;
    }
    return price.toString();
  }
}