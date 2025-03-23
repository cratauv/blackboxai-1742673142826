import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface DashboardMetric {
  label: string;
  value: string | number;
  change?: number;
  icon: string;
  color: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: Date;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <!-- Metrics -->
        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          @for (metric of metrics; track metric.label) {
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <i [class]="metric.icon + ' text-' + metric.color + '-500 text-2xl'"></i>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        {{ metric.label }}
                      </dt>
                      <dd class="flex items-baseline">
                        <div class="text-2xl font-semibold text-gray-900">
                          {{ metric.value }}
                        </div>
                        @if (metric.change !== undefined) {
                          <div
                            class="ml-2 flex items-baseline text-sm font-semibold"
                            [class]="metric.change >= 0 ? 'text-green-600' : 'text-red-600'"
                          >
                            <i
                              class="fas"
                              [class]="metric.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
                            ></i>
                            {{ Math.abs(metric.change) }}%
                          </div>
                        }
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Charts -->
        <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <!-- Revenue Chart -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <h2 class="text-lg font-medium text-gray-900">Revenue</h2>
              <!-- Add Chart Component Here -->
            </div>
          </div>

          <!-- Orders Chart -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <h2 class="text-lg font-medium text-gray-900">Orders</h2>
              <!-- Add Chart Component Here -->
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="mt-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-5 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Recent Orders</h2>
            </div>
            <div class="divide-y divide-gray-200">
              @for (order of recentOrders; track order.id) {
                <div class="px-5 py-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="text-sm font-medium text-gray-900">
                        {{ order.customer }}
                      </div>
                      <div class="ml-2 text-sm text-gray-500">
                        #{{ order.id }}
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="text-sm text-gray-500">
                        {{ order.date | date }}
                      </div>
                      <div class="ml-4 text-sm font-medium text-gray-900">
                        {{ order.amount | currency }}
                      </div>
                      <div
                        class="ml-4 px-2 py-1 text-xs font-medium rounded-full"
                        [class]="getStatusClasses(order.status)"
                      >
                        {{ order.status }}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div class="px-5 py-4 bg-gray-50">
              <a
                routerLink="/orders"
                class="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all orders
                <i class="fas fa-arrow-right ml-1"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="mt-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-5 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Top Products</h2>
            </div>
            <div class="p-5">
              <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sales
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Revenue
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stock
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          @for (product of topProducts; track product.name) {
                            <tr>
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ product.name }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ product.sales }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ product.revenue | currency }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ product.stock }}
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  metrics: DashboardMetric[] = [
    {
      label: 'Total Revenue',
      value: '$24,563',
      change: 12,
      icon: 'fas fa-dollar-sign',
      color: 'green'
    },
    {
      label: 'Total Orders',
      value: '456',
      change: 8,
      icon: 'fas fa-shopping-cart',
      color: 'blue'
    },
    {
      label: 'Total Customers',
      value: '2,345',
      change: 3.2,
      icon: 'fas fa-users',
      color: 'purple'
    },
    {
      label: 'Conversion Rate',
      value: '3.2%',
      change: -0.8,
      icon: 'fas fa-chart-line',
      color: 'yellow'
    }
  ];

  recentOrders: RecentOrder[] = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      date: new Date(),
      amount: 125.99,
      status: 'completed'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      date: new Date(),
      amount: 89.99,
      status: 'processing'
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      date: new Date(),
      amount: 199.99,
      status: 'pending'
    }
  ];

  topProducts: TopProduct[] = [
    {
      name: 'Product A',
      sales: 123,
      revenue: 12399,
      stock: 45
    },
    {
      name: 'Product B',
      sales: 98,
      revenue: 9899,
      stock: 32
    },
    {
      name: 'Product C',
      sales: 76,
      revenue: 7699,
      stock: 21
    }
  ];

  getStatusClasses(status: string): string {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes];
  }

  Math = Math;
}