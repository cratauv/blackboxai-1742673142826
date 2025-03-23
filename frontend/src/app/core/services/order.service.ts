import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from './product.service';

export interface OrderItem {
  product: string | Product; // ID when creating, Product when populated
  quantity: number;
  price: number;
  productDetails: {
    name: string;
    image: string;
  };
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  method: 'credit_card' | 'debit_card' | 'paypal';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: Date;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingInfo?: TrackingInfo;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  notes?: string;
  statusHistory: Array<{
    status: string;
    date: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderResponse {
  orders: Order[];
  page: number;
  pages: number;
  total: number;
}

export interface CreateOrderData {
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  shippingCost: number;
  tax: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderData): Observable<Order> {
    return this.http.post<Order>(this.API_URL, orderData);
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${orderId}`);
  }

  getMyOrders(page: number = 1): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.API_URL}/myorders`, {
      params: { page: page.toString() }
    });
  }

  // Admin methods
  getAllOrders(page: number = 1, filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<OrderResponse> {
    let params: any = { page: page.toString() };
    if (filters) {
      params = { ...params, ...filters };
    }
    return this.http.get<OrderResponse>(this.API_URL, { params });
  }

  updateOrderStatus(orderId: string, status: string, note?: string): Observable<Order> {
    return this.http.put<Order>(`${this.API_URL}/${orderId}/status`, { status, note });
  }

  updateOrderPayment(orderId: string, paymentInfo: {
    status: 'completed' | 'failed';
    transactionId: string;
  }): Observable<Order> {
    return this.http.put<Order>(`${this.API_URL}/${orderId}/pay`, paymentInfo);
  }

  updateTrackingInfo(orderId: string, trackingInfo: TrackingInfo): Observable<Order> {
    return this.http.put<Order>(`${this.API_URL}/${orderId}/tracking`, trackingInfo);
  }

  // Helper methods
  getOrderStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  getOrderStatusText(status: string): string {
    const statusText: { [key: string]: string } = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusText[status] || status;
  }

  formatOrderNumber(orderId: string): string {
    return `ORD-${orderId.slice(-6).toUpperCase()}`;
  }

  calculateOrderTotal(items: OrderItem[], shippingCost: number, taxRate: number = 0.1): {
    subtotal: number;
    tax: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    return {
      subtotal,
      tax,
      total
    };
  }
}