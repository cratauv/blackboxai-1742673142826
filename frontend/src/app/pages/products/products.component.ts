import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  status: 'active' | 'inactive';
  featured: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold text-gray-900">Products</h1>
          <a
            routerLink="/products/new"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <i class="fas fa-plus -ml-1 mr-2"></i>
            Add Product
          </a>
        </div>

        <!-- Filters -->
        <div class="mt-6 bg-white shadow rounded-lg">
          <div class="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Search</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  [(ngModel)]="filters.search"
                  (ngModelChange)="applyFilters()"
                  class="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search products..."
                />
              </div>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <select
                [(ngModel)]="filters.category"
                (ngModelChange)="applyFilters()"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                @for (category of categories; track category) {
                  <option [value]="category">{{ category }}</option>
                }
              </select>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select
                [(ngModel)]="filters.status"
                (ngModelChange)="applyFilters()"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Sort By</label>
              <select
                [(ngModel)]="sorting.field"
                (ngModelChange)="applySorting()"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          @for (product of displayedProducts; track product.id) {
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <!-- Product Image -->
              <div class="aspect-w-3 aspect-h-2">
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="w-full h-48 object-cover"
                />
              </div>

              <!-- Product Info -->
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [class]="getStatusClasses(product.status)"
                  >
                    {{ product.status }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-lg font-medium text-gray-900">
                    {{ product.price | currency }}
                  </span>
                  <span class="text-sm text-gray-500">
                    Stock: {{ product.stock }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="mt-4 flex space-x-2">
                  <a
                    [routerLink]="['/products', product.id]"
                    class="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    class="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white"
                    [class]="product.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                    (click)="toggleStatus(product)"
                  >
                    {{ product.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Empty State -->
        @if (displayedProducts.length === 0) {
          <div class="mt-6 text-center">
            <i class="fas fa-box-open text-gray-400 text-5xl"></i>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p class="mt-1 text-sm text-gray-500">
              Get started by creating a new product.
            </p>
            <div class="mt-6">
              <a
                routerLink="/products/new"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <i class="fas fa-plus -ml-1 mr-2"></i>
                Add Product
              </a>
            </div>
          </div>
        }

        <!-- Pagination -->
        @if (displayedProducts.length > 0) {
          <div class="mt-6 flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                type="button"
                [disabled]="currentPage === 1"
                (click)="goToPage(currentPage - 1)"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                [disabled]="currentPage === totalPages"
                (click)="goToPage(currentPage + 1)"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ startIndex + 1 }}</span>
                  to
                  <span class="font-medium">{{ endIndex }}</span>
                  of
                  <span class="font-medium">{{ filteredProducts.length }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  @for (page of pages; track page) {
                    <button
                      type="button"
                      (click)="goToPage(page)"
                      [class]="getPageButtonClasses(page)"
                    >
                      {{ page }}
                    </button>
                  }
                </nav>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductsComponent {
  products: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description for product 1',
      price: 99.99,
      category: 'Electronics',
      stock: 50,
      image: 'assets/images/products/1.jpg',
      status: 'active',
      featured: true
    },
    // Add more sample products...
  ];

  categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];

  filters = {
    search: '',
    category: '',
    status: ''
  };

  sorting = {
    field: 'name',
    direction: 'asc'
  };

  // Pagination
  itemsPerPage = 12;
  currentPage = 1;

  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchesSearch = !this.filters.search ||
        product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(this.filters.search.toLowerCase());

      const matchesCategory = !this.filters.category ||
        product.category === this.filters.category;

      const matchesStatus = !this.filters.status ||
        product.status === this.filters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      const field = this.sorting.field as keyof Product;
      const direction = this.sorting.direction === 'asc' ? 1 : -1;
      return a[field] > b[field] ? direction : -direction;
    });
  }

  get displayedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.filteredProducts.length);
  }

  applyFilters(): void {
    this.currentPage = 1;
  }

  applySorting(): void {
    this.sorting.direction = this.sorting.direction === 'asc' ? 'desc' : 'asc';
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  toggleStatus(product: Product): void {
    product.status = product.status === 'active' ? 'inactive' : 'active';
  }

  getStatusClasses(status: string): string {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  getPageButtonClasses(page: number): string {
    const baseClasses = 'relative inline-flex items-center px-4 py-2 border text-sm font-medium';
    return page === this.currentPage
      ? `${baseClasses} z-10 bg-primary-50 border-primary-500 text-primary-600`
      : `${baseClasses} bg-white border-gray-300 text-gray-500 hover:bg-gray-50`;
  }
}