import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Modern E-commerce</span>
                <span class="block text-primary-600 xl:inline">Platform</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Experience the future of online shopping with our cutting-edge e-commerce platform. 
                Built with modern technologies for speed, security, and seamless user experience.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <app-button
                    variant="primary"
                    size="lg"
                    [routerLink]="['/auth/register']"
                  >
                    Get started
                  </app-button>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <app-button
                    variant="outline"
                    size="lg"
                    [routerLink]="['/products']"
                  >
                    View Products
                  </app-button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="assets/images/hero.jpg"
          alt="E-commerce platform"
        >
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides all the tools and features you need to build and grow your online business.
          </p>
        </div>

        <div class="mt-10">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            @for (feature of features; track feature.name) {
              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <i [class]="feature.icon + ' text-xl'"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">{{ feature.name }}</p>
                <p class="mt-2 ml-16 text-base text-gray-500">{{ feature.description }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-gray-900">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
            Trusted by users worldwide
          </h2>
          <p class="mt-3 text-xl text-gray-300 sm:mt-4">
            Our platform helps businesses reach their goals
          </p>
        </div>
        <dl class="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
          @for (stat of stats; track stat.name) {
            <div class="flex flex-col">
              <dt class="order-2 mt-2 text-lg leading-6 font-medium text-gray-300">
                {{ stat.name }}
              </dt>
              <dd class="order-1 text-5xl font-extrabold text-white">
                {{ stat.value }}
              </dd>
            </div>
          }
        </dl>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span class="block">Ready to dive in?</span>
          <span class="block text-primary-600">Start your free trial today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <app-button
              variant="primary"
              size="lg"
              [routerLink]="['/auth/register']"
            >
              Get started
            </app-button>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <app-button
              variant="secondary"
              size="lg"
              [routerLink]="['/contact']"
            >
              Learn more
            </app-button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingComponent {
  features = [
    {
      name: 'Easy Integration',
      description: 'Connect with your existing tools and platforms seamlessly.',
      icon: 'fas fa-plug'
    },
    {
      name: 'Secure Payments',
      description: 'Multiple payment options with enterprise-grade security.',
      icon: 'fas fa-lock'
    },
    {
      name: 'Analytics',
      description: 'Detailed insights and reports to grow your business.',
      icon: 'fas fa-chart-line'
    },
    {
      name: 'Mobile First',
      description: 'Optimized for all devices with responsive design.',
      icon: 'fas fa-mobile-alt'
    }
  ];

  stats = [
    {
      name: 'Active Users',
      value: '100K+'
    },
    {
      name: 'Transactions',
      value: '$10M+'
    },
    {
      name: 'Success Rate',
      value: '99.9%'
    }
  ];
}