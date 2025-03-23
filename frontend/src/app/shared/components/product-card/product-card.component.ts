import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface ProductCardData {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockCount?: number;
  badges?: string[];
  category?: string;
  brand?: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      [class.opacity-75]="!product.inStock"
    >
      <!-- Badges -->
      @if (product.badges && product.badges.length > 0) {
        <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
          @for (badge of product.badges; track badge) {
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {{ badge }}
            </span>
          }
        </div>
      }

      <!-- Wishlist Button -->
      @if (showWishlist) {
        <button
          type="button"
          class="absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50"
          (click)="onWishlistClick($event)"
        >
          <i
            class="text-gray-400 hover:text-primary-500"
            [class]="isWishlisted ? 'fas fa-heart text-primary-500' : 'far fa-heart'"
          ></i>
        </button>
      }

      <!-- Image -->
      <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
        <img
          [src]="product.image"
          [alt]="product.name"
          class="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
        >
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Category & Brand -->
        @if (product.category || product.brand) {
          <div class="text-sm text-gray-500 mb-1">
            {{ [product.category, product.brand].filter(Boolean).join(' • ') }}
          </div>
        }

        <!-- Name -->
        <h3 class="text-sm font-medium text-gray-900">
          <a [routerLink]="['/products', product.id]">
            {{ product.name }}
          </a>
        </h3>

        <!-- Description -->
        @if (product.description) {
          <p class="mt-1 text-sm text-gray-500 line-clamp-2">
            {{ product.description }}
          </p>
        }

        <!-- Rating -->
        @if (showRating && product.rating !== undefined) {
          <div class="mt-2 flex items-center">
            <div class="flex items-center">
              @for (star of [1,2,3,4,5]; track star) {
                <i
                  class="text-sm"
                  [class]="star <= product.rating ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'"
                ></i>
              }
            </div>
            @if (product.reviewCount) {
              <span class="ml-2 text-sm text-gray-500">
                ({{ product.reviewCount }})
              </span>
            }
          </div>
        }

        <!-- Price -->
        <div class="mt-2 flex items-center justify-between">
          <div>
            <span class="text-base font-medium text-gray-900">
              {{ formatPrice(product.price) }}
            </span>
            @if (product.originalPrice) {
              <span class="ml-2 text-sm text-gray-500 line-through">
                {{ formatPrice(product.originalPrice) }}
              </span>
            }
          </div>

          <!-- Stock Status -->
          @if (showStock) {
            <div class="text-sm">
              @if (product.inStock) {
                <span class="text-success-600">In Stock</span>
                @if (product.stockCount) {
                  <span class="text-gray-500">
                    ({{ product.stockCount }})
                  </span>
                }
              } @else {
                <span class="text-error-600">Out of Stock</span>
              }
            </div>
          }
        </div>

        <!-- Add to Cart Button -->
        @if (showAddToCart) {
          <button
            type="button"
            class="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            [disabled]="!product.inStock"
            (click)="onAddToCart($event)"
          >
            <i class="fas fa-shopping-cart mr-2"></i>
            Add to Cart
          </button>
        }
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: ProductCardData;
  @Input() showRating = true;
  @Input() showStock = true;
  @Input() showWishlist = true;
  @Input() showAddToCart = true;
  @Input() isWishlisted = false;
  @Input() currency = 'USD';

  @Output() addToCart = new EventEmitter<ProductCardData>();
  @Output() wishlistToggle = new EventEmitter<ProductCardData>();

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency
    }).format(price);
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.product.inStock) {
      this.addToCart.emit(this.product);
    }
  }

  onWishlistClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistToggle.emit(this.product);
  }

  // Helper method to update product data
  updateProduct(product: Partial<ProductCardData>): void {
    this.product = { ...this.product, ...product };
  }

  // Helper method to update stock
  updateStock(inStock: boolean, stockCount?: number): void {
    this.product.inStock = inStock;
    if (stockCount !== undefined) {
      this.product.stockCount = stockCount;
    }
  }

  // Helper method to update price
  updatePrice(price: number, originalPrice?: number): void {
    this.product.price = price;
    if (originalPrice !== undefined) {
      this.product.originalPrice = originalPrice;
    }
  }

  // Helper method to update rating
  updateRating(rating: number, reviewCount?: number): void {
    this.product.rating = rating;
    if (reviewCount !== undefined) {
      this.product.reviewCount = reviewCount;
    }
  }

  // Helper method to add badge
  addBadge(badge: string): void {
    if (!this.product.badges) {
      this.product.badges = [];
    }
    if (!this.product.badges.includes(badge)) {
      this.product.badges.push(badge);
    }
  }

  // Helper method to remove badge
  removeBadge(badge: string): void {
    if (this.product.badges) {
      this.product.badges = this.product.badges.filter(b => b !== badge);
    }
  }

  // Helper method to clear badges
  clearBadges(): void {
    this.product.badges = [];
  }

  // Helper method to toggle wishlist
  toggleWishlist(): void {
    this.isWishlisted = !this.isWishlisted;
  }

  // Helper method to set currency
  setCurrency(currency: string): void {
    this.currency = currency;
  }

  // Helper method to check if product is on sale
  isOnSale(): boolean {
    return !!this.product.originalPrice && this.product.originalPrice > this.product.price;
  }

  // Helper method to get discount percentage
  getDiscountPercentage(): number {
    if (this.product.originalPrice) {
      return Math.round(
        ((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100
      );
    }
    return 0;
  }

  // Helper method to get rating stars array
  getRatingStars(): boolean[] {
    return Array(5).fill(false).map((_, i) => i < (this.product.rating || 0));
  }
}