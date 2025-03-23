import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  date: Date;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold text-gray-900">Orders</h1>
          <div class="flex items-center space-x-3">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              (click)="exportOrders()"
            >
              <i class="fas fa-download mr-2"></i>
              Export
            </button>
          </div>
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
                  placeholder="Search orders..."
                />
              </div>
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
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Date Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700">From Date</label>
              <input
                type="date"
                [(ngModel)]="filters.fromDate"
                (ngModelChange)="applyFilters()"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                [(ngModel)]="filters.toDate"
                (ngModelChange)="applyFilters()"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="mt-6 bg-white shadow rounded-lg">
          <div class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          (click)="sortBy('id')"
                        >
                          Order ID
                          <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          (click)="sortBy('customer.name')"
                        >
                          Customer
                          <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          (click)="sortBy('date')"
                        >
                          Date
                          <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          (click)="sortBy('total')"
                        >
                          Total
                          <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      @for (order of displayedOrders; track order.id) {
                        <tr>
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{ order.id }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              @if (order.customer.avatar) {
                                <img
                                  [src]="order.customer.avatar"
                                  class="h-8 w-8 rounded-full"
                                  [alt]="order.customer.name"
                                />
                              } @else {
                                <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span class="text-sm font-medium text-primary-600">
                                    {{ getInitials(order.customer.name) }}
                                  </span>
                                </div>
                              }
                              <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">
                                  {{ order.customer.name }}
                                </div>
                                <div class="text-sm text-gray-500">
                                  {{ order.customer.email }}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ order.date | date }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ order.total | currency }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              [class]="getStatusClasses(order.status)"
                            >
                              {{ order.status }}
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              [class]="getPaymentStatusClasses(order.paymentStatus)"
                            >
                              {{ order.paymentStatus }}
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a
                              [routerLink]="['/orders', order.id]"
                              class="text-primary-600 hover:text-primary-900"
                            >
                              View Details
                            </a>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          @if (displayedOrders.length > 0) {
            <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div class="flex items-center justify-between">
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
                      <span class="font-medium">{{ filteredOrders.length }}</span>
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
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent {
  orders: Order[] = [
    {
      id: 'ORD-001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      date: new Date(),
      total: 99.99,
      status: 'pending',
      paymentStatus: 'pending',
      items: [
        {
          id: 'ITEM-1',
          name: 'Product 1',
          quantity: 1,
          price: 99.99
        }
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'US'
      }
    }
    // Add more sample orders...
  ];

  filters = {
    search: '',
    status: '',
    fromDate: '',
    toDate: ''
  };

  sorting = {
    field: 'date',
    direction: 'desc'
  };

  // Pagination
  itemsPerPage = 10;
  currentPage = 1;

  get filteredOrders(): Order[] {
    return this.orders.filter(order => {
      const matchesSearch = !this.filters.search ||
        order.id.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(this.filters.search.toLowerCase());

      const matchesStatus = !this.filters.status ||
        order.status === this.filters.status;

      const matchesDateRange = (!this.filters.fromDate || new Date(order.date) >= new Date(this.filters.fromDate)) &&
        (!this.filters.toDate || new Date(order.date) <= new Date(this.filters.toDate));

      return matchesSearch && matchesStatus && matchesDateRange;
    }).sort((a, b) => {
      const aValue = this.getSortValue(a, this.sorting.field);
      const bValue = this.getSortValue(b, this.sorting.field);
      const direction = this.sorting.direction === 'asc' ? 1 : -1;
      return aValue > bValue ? direction : -direction;
    });
  }

  get displayedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredOrders.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.filteredOrders.length);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  getStatusClasses(status: string): string {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes];
  }

  getPaymentStatusClasses(status: string): string {
    const classes = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes];
  }

  getPageButtonClasses(page: number): string {
    const baseClasses = 'relative inline-flex items-center px-4 py-2 border text-sm font-medium';
    return page === this.currentPage
      ? `${baseClasses} z-10 bg-primary-50 border-primary-500 text-primary-600`
      : `${baseClasses} bg-white border-gray-300 text-gray-500 hover:bg-gray-50`;
  }

  applyFilters(): void {
    this.currentPage = 1;
  }

  sortBy(field: string): void {
    if (this.sorting.field === field) {
      this.sorting.direction = this.sorting.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sorting.field = field;
      this.sorting.direction = 'asc';
    }
  }

  getSortValue(order: Order, field: string): any {
    const fields = field.split('.');
    let value: any = order;
    for (const f of fields) {
      value = value[f];
    }
    return value;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  exportOrders(): void {
    // Implement export functionality
    console.log('Exporting orders...');
  }
}