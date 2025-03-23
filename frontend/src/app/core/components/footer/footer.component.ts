import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  path: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-white border-t">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="xl:grid xl:grid-cols-3 xl:gap-8">
          <!-- Company Info -->
          <div class="space-y-8 xl:col-span-1">
            <img
              class="h-10"
              src="assets/images/logo.svg"
              alt="Company Logo"
            >
            <p class="text-gray-500 text-base">
              Making the world a better place through quality e-commerce solutions.
            </p>
            <div class="flex space-x-6">
              @for (social of socialLinks; track social.name) {
                <a
                  [href]="social.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-gray-500"
                >
                  <span class="sr-only">{{ social.name }}</span>
                  <i [class]="social.icon + ' text-xl'"></i>
                </a>
              }
            </div>
          </div>

          <!-- Footer Sections -->
          <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div class="md:grid md:grid-cols-2 md:gap-8">
              @for (section of footerSections.slice(0, 2); track section.title) {
                <div class="mt-12 md:mt-0">
                  <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    {{ section.title }}
                  </h3>
                  <ul role="list" class="mt-4 space-y-4">
                    @for (link of section.links; track link.label) {
                      <li>
                        <a
                          [routerLink]="link.path"
                          class="text-base text-gray-500 hover:text-gray-900"
                        >
                          {{ link.label }}
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
            <div class="md:grid md:grid-cols-2 md:gap-8">
              @for (section of footerSections.slice(2); track section.title) {
                <div class="mt-12 md:mt-0">
                  <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    {{ section.title }}
                  </h3>
                  <ul role="list" class="mt-4 space-y-4">
                    @for (link of section.links; track link.label) {
                      <li>
                        <a
                          [routerLink]="link.path"
                          class="text-base text-gray-500 hover:text-gray-900"
                        >
                          {{ link.label }}
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="mt-12 border-t border-gray-200 pt-8">
          <div class="max-w-md mx-auto">
            <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Subscribe to our newsletter
            </h3>
            <p class="mt-2 text-base text-gray-500">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <form class="mt-4 sm:flex">
              <label for="email-address" class="sr-only">Email address</label>
              <input
                type="email"
                [(ngModel)]="emailSubscription"
                name="email-address"
                id="email-address"
                autocomplete="email"
                required
                class="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:placeholder-gray-400"
                placeholder="Enter your email"
              >
              <div class="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  (click)="onSubscribe()"
                  class="w-full bg-primary-600 flex items-center justify-center border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 border-t border-gray-200 pt-8">
          <p class="text-base text-gray-400 xl:text-center">
            &copy; {{ currentYear }} Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  emailSubscription = '';

  socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: 'fab fa-facebook'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: 'fab fa-instagram'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: 'fab fa-twitter'
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: 'fab fa-github'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: 'fab fa-linkedin'
    }
  ];

  footerSections: FooterSection[] = [
    {
      title: 'Solutions',
      links: [
        { label: 'Marketing', path: '/solutions/marketing' },
        { label: 'Analytics', path: '/solutions/analytics' },
        { label: 'Commerce', path: '/solutions/commerce' },
        { label: 'Insights', path: '/solutions/insights' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/support' },
        { label: 'Documentation', path: '/docs' },
        { label: 'API Status', path: '/status' },
        { label: 'Contact', path: '/contact' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'Blog', path: '/blog' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press', path: '/press' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', path: '/privacy' },
        { label: 'Terms', path: '/terms' },
        { label: 'Cookie Policy', path: '/cookies' },
        { label: 'Licenses', path: '/licenses' }
      ]
    }
  ];

  onSubscribe(): void {
    if (this.emailSubscription && this.isValidEmail(this.emailSubscription)) {
      // Implement newsletter subscription
      console.log('Subscribing email:', this.emailSubscription);
      this.emailSubscription = '';
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}