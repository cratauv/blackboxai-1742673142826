import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <!-- Product Image -->
      <div class="relative aspect-w-1 aspect-h-1 group">
        <img 
          [src]="product.images[0]?.url || 'assets/images/placeholder.jpg'"
          [alt]="product.name"
          class="object-cover w-full h-full"
        />
        
        <!-- Quick Actions Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="space-x-4">
            <!-- View Details -->
            <a 
              [routerLink]="['/products', product._id]"
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
            >
              <i class="fas fa-eye"></i>
            </a>
            
            <!-- Add to Cart -->
            <button 
              (click)="addToCart()"
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
              [class.opacity-50]="!product.stock"
              [disabled]="!product.stock"
            >
              <i class="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div>

        <!-- Stock Badge -->
        @if (!product.stock) {
          <span class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
            Out of Stock
          </span>
        }

        <!-- Discount Badge -->
        @if (hasDiscount) {
          <span class="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
            {{ discountPercentage }}% OFF
          </span>
        }
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <!-- Category -->
        <p class="text-sm text-gray-500 mb-2">{{ product.category }}</p>
        
        <!-- Name -->
        <h3 class="text-lg font-semibold mb-2 line-clamp-2">
          <a [routerLink]="['/products', product._id]" class="hover:text-primary-600">
            {{ product.name }}
          </a>
        </h3>

        <!-- Price -->
        <div class="flex items-baseline mb-2">
          <span class="text-xl font-bold text-primary-600">${{ discountedPrice }}</span>
          @if (hasDiscount) {
            <span class="ml-2 text-sm text-gray-500 line-through">${{ product.price }}</span>
          }
        </div>

        <!-- Rating -->
        <div class="flex items-center mb-4">
          <div class="flex text-yellow-400">
            @for (star of [1,2,3,4,5]; track star) {
              <i class="fas fa-star" [class.text-gray-300]="star > averageRating"></i>
            }
          </div>
          <span class="ml-2 text-sm text-gray-600">({{ product.ratings?.length || 0 }})</span>
        </div>

        <!-- Add to Cart Button -->
        <button
          (click)="addToCart()"
          class="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
          [class.opacity-50]="!product.stock"
          [disabled]="!product.stock"
        >
          @if (product.stock) {
            Add to Cart
          } @else {
            Out of Stock
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCartEvent = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  get hasDiscount(): boolean {
    return !!(
      this.product.discounts?.percentage &&
      this.product.discounts?.validUntil &&
      new Date(this.product.discounts.validUntil) > new Date()
    );
  }

  get discountPercentage(): number {
    return this.product.discounts?.percentage || 0;
  }

  get discountedPrice(): number {
    if (this.hasDiscount) {
      return +(this.product.price * (1 - this.discountPercentage / 100)).toFixed(2);
    }
    return this.product.price;
  }

  get averageRating(): number {
    if (!this.product.ratings?.length) return 0;
    const sum = this.product.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / this.product.ratings.length) * 2) / 2;
  }

  addToCart(): void {
    if (!this.product.stock) {
      this.notificationService.warning('This product is out of stock');
      return;
    }

    this.cartService.addToCart(this.product);
    this.notificationService.success('Product added to cart');
    this.addToCartEvent.emit();
  }
}