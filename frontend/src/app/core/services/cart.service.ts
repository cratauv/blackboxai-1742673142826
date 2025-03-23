import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'shopping_cart';
  private readonly TAX_RATE = 0.1; // 10% tax rate

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartSummary = new BehaviorSubject<CartSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    itemCount: 0
  });

  cartItems$ = this.cartItems.asObservable();
  cartSummary$ = this.cartSummary.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
      this.updateCartSummary();
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems.value));
    this.updateCartSummary();
  }

  private updateCartSummary(): void {
    const items = this.cartItems.value;
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => {
      const price = this.calculateItemPrice(item);
      return total + (price * item.quantity);
    }, 0);

    // Calculate shipping based on total items and weight
    const shipping = this.calculateShipping(items);
    const tax = subtotal * this.TAX_RATE;
    const total = subtotal + shipping + tax;

    this.cartSummary.next({
      subtotal,
      shipping,
      tax,
      total,
      itemCount
    });
  }

  private calculateItemPrice(item: CartItem): number {
    const { product } = item;
    if (product.discounts && 
        product.discounts.percentage && 
        product.discounts.validUntil && 
        new Date(product.discounts.validUntil) > new Date()) {
      return product.price * (1 - product.discounts.percentage / 100);
    }
    return product.price;
  }

  private calculateShipping(items: CartItem[]): number {
    // Basic shipping calculation based on item quantity and weight
    const baseShippingRate = 5;
    const totalWeight = items.reduce((total, item) => {
      return total + (item.product.shipping?.weight || 0) * item.quantity;
    }, 0);
    
    return baseShippingRate + (totalWeight * 0.5); // $0.50 per weight unit
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItems.next(currentItems);
    this.saveCart();
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.product._id !== productId);
    
    this.cartItems.next(updatedItems);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product._id === productId);

    if (item) {
      item.quantity = quantity;
      this.cartItems.next(currentItems);
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    localStorage.removeItem(this.CART_STORAGE_KEY);
    this.updateCartSummary();
  }

  getCartItemCount(): number {
    return this.cartSummary.value.itemCount;
  }

  getCartTotal(): number {
    return this.cartSummary.value.total;
  }

  isProductInCart(productId: string): boolean {
    return this.cartItems.value.some(item => item.product._id === productId);
  }

  getItemQuantity(productId: string): number {
    const item = this.cartItems.value.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  }
}