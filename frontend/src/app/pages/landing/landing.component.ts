import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <div class="pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
            <div class="text-center">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block">Modern E-commerce</span>
                <span class="block text-primary-600">Platform for Everyone</span>
              </h1>
              <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Start selling online with our easy-to-use platform. Create your store, add products, and reach customers worldwide.
              </p>
              <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div class="rounded-md shadow">
                  <a
                    routerLink="/signup"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </a>
                </div>
                <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <a
                    routerLink="/demo"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 bg-gray-50 overflow-hidden md:py-20 lg:py-24">
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative">
          <h2 class="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed online
          </h2>
          <p class="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Powerful features to help you manage your business efficiently
          </p>
        </div>

        <div class="relative mt-12 lg:mt-20 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div class="mt-10 space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            @for (feature of features; track feature.title) {
              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <i [class]="feature.icon"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">{{ feature.title }}</p>
                <p class="mt-2 ml-16 text-base text-gray-500">{{ feature.description }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-12 bg-white overflow-hidden md:py-20 lg:py-24">
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative">
          <h2 class="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by businesses worldwide
          </h2>
          <p class="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            See what our customers are saying about us
          </p>
        </div>

        <div class="mt-20">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (testimonial of testimonials; track testimonial.author) {
              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="px-6 py-8">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        class="h-10 w-10 rounded-full"
                        [src]="testimonial.avatar"
                        [alt]="testimonial.author"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ testimonial.author }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ testimonial.role }}
                      </div>
                    </div>
                  </div>
                  <p class="mt-4 text-base text-gray-500">
                    "{{ testimonial.content }}"
                  </p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-700">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to get started?</span>
          <span class="block">Start your free trial today.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-primary-200">
          Try our platform free for 14 days. No credit card required.
        </p>
        <a
          routerLink="/signup"
          class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
        >
          Sign up for free
        </a>
      </div>
    </section>
  `
})
export class LandingComponent {
  features = [
    {
      icon: 'fas fa-store',
      title: 'Online Store',
      description: 'Create your online store with customizable templates and themes.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Analytics',
      description: 'Track your sales, customers, and inventory with detailed analytics.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile App',
      description: 'Manage your business on the go with our mobile application.'
    },
    {
      icon: 'fas fa-globe',
      title: 'Global Reach',
      description: 'Sell your products to customers worldwide with multi-currency support.'
    }
  ];

  testimonials = [
    {
      author: 'Sarah Johnson',
      role: 'CEO at TechStart',
      avatar: 'assets/images/testimonials/sarah.jpg',
      content: 'This platform has transformed our business. The ease of use and powerful features have helped us grow our online presence significantly.'
    },
    {
      author: 'Michael Chen',
      role: 'Founder at StyleCo',
      avatar: 'assets/images/testimonials/michael.jpg',
      content: 'The analytics and inventory management tools are exceptional. We\'ve been able to make better business decisions with the insights provided.'
    },
    {
      author: 'Emily Brown',
      role: 'Owner at Artisan Crafts',
      avatar: 'assets/images/testimonials/emily.jpg',
      content: 'As a small business owner, I appreciate how easy it is to get started. The customer support team has been incredibly helpful throughout our journey.'
    }
  ];
}