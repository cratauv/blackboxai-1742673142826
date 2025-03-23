import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

type PriceSize = 'sm' | 'md' | 'lg' | 'xl';
type PriceColor = 'default' | 'success' | 'error' | 'warning' | 'muted';

@Component({
  selector: 'app-price-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-baseline" [class]="getContainerClasses()">
      <!-- Currency Symbol -->
      @if (showCurrency && currencyPosition === 'before') {
        <span [class]="getSymbolClasses()">{{ currencySymbol }}</span>
      }

      <!-- Main Price -->
      <span [class]="getMainPriceClasses()">
        {{ formatMainPrice() }}
      </span>

      <!-- Decimal Part -->
      @if (showDecimals) {
        <span [class]="getDecimalClasses()">
          {{ formatDecimalPart() }}
        </span>
      }

      <!-- Currency Symbol (after) -->
      @if (showCurrency && currencyPosition === 'after') {
        <span [class]="getSymbolClasses()">{{ currencySymbol }}</span>
      }

      <!-- Original Price -->
      @if (originalPrice !== undefined && originalPrice > price) {
        <span [class]="getOriginalPriceClasses()">
          {{ formatOriginalPrice() }}
        </span>
      }

      <!-- Discount Badge -->
      @if (showDiscount && originalPrice !== undefined && originalPrice > price) {
        <span [class]="getDiscountBadgeClasses()">
          -{{ calculateDiscount() }}%
        </span>
      }
    </div>
  `
})
export class PriceDisplayComponent implements OnChanges {
  @Input() price = 0;
  @Input() originalPrice?: number;
  @Input() currency = 'USD';
  @Input() currencySymbol = '$';
  @Input() currencyPosition: 'before' | 'after' = 'before';
  @Input() size: PriceSize = 'md';
  @Input() color: PriceColor = 'default';
  @Input() showCurrency = true;
  @Input() showDecimals = true;
  @Input() showDiscount = false;
  @Input() minimumFractionDigits = 2;
  @Input() maximumFractionDigits = 2;
  @Input() locale = 'en-US';

  private formatter: Intl.NumberFormat;

  constructor() {
    this.initFormatter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currency'] || changes['minimumFractionDigits'] || 
        changes['maximumFractionDigits'] || changes['locale']) {
      this.initFormatter();
    }
  }

  private initFormatter(): void {
    this.formatter = new Intl.NumberFormat(this.locale, {
      minimumFractionDigits: this.minimumFractionDigits,
      maximumFractionDigits: this.maximumFractionDigits
    });
  }

  getContainerClasses(): string {
    return `font-medium ${this.color === 'muted' ? 'text-gray-500' : ''}`;
  }

  getSymbolClasses(): string {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };

    return `${sizeClasses[this.size]} mx-0.5`;
  }

  getMainPriceClasses(): string {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-2xl'
    };

    const colorClasses = {
      default: 'text-gray-900',
      success: 'text-success-600',
      error: 'text-error-600',
      warning: 'text-warning-600',
      muted: 'text-gray-500'
    };

    return `${sizeClasses[this.size]} ${colorClasses[this.color]} font-semibold`;
  }

  getDecimalClasses(): string {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };

    return `${sizeClasses[this.size]} font-medium`;
  }

  getOriginalPriceClasses(): string {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };

    return `${sizeClasses[this.size]} ml-2 text-gray-500 line-through`;
  }

  getDiscountBadgeClasses(): string {
    const sizeClasses = {
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-sm px-2 py-0.5',
      lg: 'text-base px-2.5 py-1',
      xl: 'text-lg px-3 py-1'
    };

    return `${sizeClasses[this.size]} ml-2 bg-success-100 text-success-800 rounded-full font-medium`;
  }

  formatMainPrice(): string {
    const [wholePart] = this.formatter.format(this.price).split('.');
    return wholePart;
  }

  formatDecimalPart(): string {
    const parts = this.formatter.format(this.price).split('.');
    return parts.length > 1 ? parts[1] : '00';
  }

  formatOriginalPrice(): string {
    return this.originalPrice !== undefined ? this.formatter.format(this.originalPrice) : '';
  }

  calculateDiscount(): number {
    if (this.originalPrice === undefined || this.originalPrice <= this.price) {
      return 0;
    }
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }

  // Helper method to format full price
  formatFullPrice(): string {
    return this.formatter.format(this.price);
  }

  // Helper method to set price
  setPrice(price: number, originalPrice?: number): void {
    this.price = price;
    this.originalPrice = originalPrice;
  }

  // Helper method to set currency
  setCurrency(currency: string, symbol: string): void {
    this.currency = currency;
    this.currencySymbol = symbol;
    this.initFormatter();
  }

  // Helper method to set locale
  setLocale(locale: string): void {
    this.locale = locale;
    this.initFormatter();
  }

  // Helper method to set fraction digits
  setFractionDigits(min: number, max: number): void {
    this.minimumFractionDigits = min;
    this.maximumFractionDigits = max;
    this.initFormatter();
  }

  // Helper method to toggle currency display
  toggleCurrency(show: boolean): void {
    this.showCurrency = show;
  }

  // Helper method to toggle decimals display
  toggleDecimals(show: boolean): void {
    this.showDecimals = show;
  }

  // Helper method to toggle discount display
  toggleDiscount(show: boolean): void {
    this.showDiscount = show;
  }

  // Helper method to set size
  setSize(size: PriceSize): void {
    this.size = size;
  }

  // Helper method to set color
  setColor(color: PriceColor): void {
    this.color = color;
  }

  // Helper method to check if price is discounted
  isDiscounted(): boolean {
    return this.originalPrice !== undefined && this.originalPrice > this.price;
  }

  // Helper method to get discount amount
  getDiscountAmount(): number {
    return this.originalPrice !== undefined ? this.originalPrice - this.price : 0;
  }
}