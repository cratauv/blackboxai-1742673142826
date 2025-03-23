import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  category: string;
  stock: number;
  vendor: {
    name: string;
    id: string;
  };
  specifications: Array<{
    name: string;
    value: string;
  }>;
  ratings: Array<{
    user: string;
    rating: number;
    review: string;
    date: Date;
  }>;
  averageRating: number;
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    shippingCost: number;
  };
  status: 'active' | 'inactive' | 'out_of_stock';
  tags: string[];
  discounts?: {
    percentage: number;
    validUntil: Date;
  };
}

export interface ProductResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

export interface ProductFilters {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters = {}): Observable<ProductResponse> {
    let params = new HttpParams();

    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.append(key, value.toString());
      }
    });

    return this.http.get<ProductResponse>(this.API_URL, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.API_URL, productData);
  }

  updateProduct(id: string, productData: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, productData);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }

  addProductReview(productId: string, rating: number, review: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/${productId}/reviews`, {
      rating,
      review
    });
  }

  getProductCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/categories`);
  }

  updateProductStock(productId: string, stock: number): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${productId}/stock`, { stock });
  }

  // Helper method to get full image URL
  getImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${environment.imageBaseUrl}/${imageUrl}`;
  }

  // Helper method to calculate discounted price
  calculateDiscountedPrice(product: Product): number {
    if (product.discounts && 
        product.discounts.percentage && 
        product.discounts.validUntil && 
        new Date(product.discounts.validUntil) > new Date()) {
      return product.price * (1 - product.discounts.percentage / 100);
    }
    return product.price;
  }

  // Helper method to check if product is in stock
  isInStock(product: Product): boolean {
    return product.stock > 0 && product.status === 'active';
  }
}