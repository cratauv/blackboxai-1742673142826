import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Breadcrumb {
  label: string;
  link?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <!-- Home -->
        <li class="inline-flex items-center">
          <a
            routerLink="/"
            class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-home mr-2"></i>
            Home
          </a>
        </li>

        <!-- Breadcrumb Items -->
        @for (item of items; track item; let last = $last) {
          <li>
            <!-- Separator -->
            <div class="flex items-center">
              <i class="fas fa-chevron-right text-gray-400 mx-2"></i>
              
              @if (last || !item.link) {
                <!-- Current/Last Item -->
                <span 
                  class="text-sm font-medium text-gray-700"
                  [class.text-primary-600]="highlightLast && last"
                >
                  @if (item.icon) {
                    <i [class]="item.icon" class="mr-2"></i>
                  }
                  {{ item.label }}
                </span>
              } @else {
                <!-- Linked Item -->
                <a
                  [routerLink]="item.link"
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  @if (item.icon) {
                    <i [class]="item.icon" class="mr-2"></i>
                  }
                  {{ item.label }}
                </a>
              }
            </div>
          </li>
        }
      </ol>

      <!-- Schema.org Structured Data -->
      @if (useStructuredData) {
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "{{ baseUrl }}"
              }
              @for (item of items; track item; let i = $index) {
                ,{
                  "@type": "ListItem",
                  "position": {{ i + 2 }},
                  "name": "{{ item.label }}"
                  @if (item.link) {
                    ,"item": "{{ baseUrl }}{{ item.link }}"
                  }
                }
              }
            ]
          }
        </script>
      }
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
      .inline-flex {
        flex-wrap: wrap;
      }
    }
  `]
})
export class BreadcrumbComponent {
  @Input() items: Breadcrumb[] = [];
  @Input() highlightLast = true;
  @Input() useStructuredData = true;
  @Input() baseUrl = 'https://your-domain.com';

  // Helper method to get the full URL for structured data
  getFullUrl(path?: string): string {
    if (!path) return this.baseUrl;
    return `${this.baseUrl}${path}`;
  }

  // Helper method to check if an item is the last in the list
  isLastItem(index: number): boolean {
    return index === this.items.length - 1;
  }

  // Helper method to get structured data
  getStructuredData(): string {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': this.baseUrl
        },
        ...this.items.map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 2,
          'name': item.label,
          ...(item.link && { 'item': this.getFullUrl(item.link) })
        }))
      ]
    };

    return JSON.stringify(data, null, 2);
  }

  // Helper method to truncate long breadcrumb items
  truncateLabel(label: string, maxLength: number = 20): string {
    if (label.length <= maxLength) return label;
    return `${label.substring(0, maxLength)}...`;
  }
}