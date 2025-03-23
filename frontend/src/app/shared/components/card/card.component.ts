import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="bg-white rounded-lg shadow-sm overflow-hidden"
      [class.hover:shadow-md]="hoverable"
      [class.transition-shadow]="hoverable"
      [class.cursor-pointer]="clickable || routerLink"
      [class.border]="bordered"
      [class.border-gray-200]="bordered"
      (click)="onClick()"
    >
      <!-- Card Image -->
      @if (image) {
        <div
          [class.aspect-video]="imageAspectRatio === '16:9'"
          [class.aspect-square]="imageAspectRatio === '1:1'"
        >
          <img
            [src]="image"
            [alt]="imageAlt || title"
            class="w-full h-full object-cover"
            [class.rounded-t-lg]="true"
          >
        </div>
      }

      <!-- Card Header -->
      @if (showHeader) {
        <div
          class="px-4 py-3 border-b border-gray-200"
          [class.bg-gray-50]="headerBackground"
        >
          @if (title) {
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          }
          @if (subtitle) {
            <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
          }
          @if (headerContent) {
            <ng-content select="[slot=header]"></ng-content>
          }
        </div>
      }

      <!-- Card Body -->
      <div [class]="getBodyClasses()">
        <ng-content></ng-content>
      </div>

      <!-- Card Footer -->
      @if (showFooter) {
        <div
          class="px-4 py-3 border-t border-gray-200"
          [class.bg-gray-50]="footerBackground"
        >
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      }

      <!-- Loading Overlay -->
      @if (loading) {
        <div class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .aspect-video {
      aspect-ratio: 16 / 9;
    }

    .aspect-square {
      aspect-ratio: 1 / 1;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() image = '';
  @Input() imageAlt = '';
  @Input() imageAspectRatio: '16:9' | '1:1' = '16:9';
  @Input() hoverable = false;
  @Input() clickable = false;
  @Input() bordered = true;
  @Input() loading = false;
  @Input() showHeader = false;
  @Input() showFooter = false;
  @Input() headerBackground = false;
  @Input() footerBackground = false;
  @Input() padding: 'none' | 'small' | 'medium' | 'large' = 'medium';
  @Input() routerLink?: string | any[];

  // Computed property to check if header content exists
  get headerContent(): boolean {
    return this.title || this.subtitle;
  }

  getBodyClasses(): string {
    const paddingClasses = {
      none: '',
      small: 'p-2',
      medium: 'p-4',
      large: 'p-6'
    };

    return paddingClasses[this.padding];
  }

  onClick(): void {
    if (this.clickable) {
      // Emit click event if needed
    }
  }

  // Helper method to set loading state
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  // Helper method to set title
  setTitle(title: string): void {
    this.title = title;
  }

  // Helper method to set subtitle
  setSubtitle(subtitle: string): void {
    this.subtitle = subtitle;
  }

  // Helper method to set image
  setImage(image: string, alt?: string): void {
    this.image = image;
    if (alt) {
      this.imageAlt = alt;
    }
  }

  // Helper method to toggle header
  toggleHeader(show: boolean): void {
    this.showHeader = show;
  }

  // Helper method to toggle footer
  toggleFooter(show: boolean): void {
    this.showFooter = show;
  }

  // Helper method to set padding
  setPadding(padding: 'none' | 'small' | 'medium' | 'large'): void {
    this.padding = padding;
  }

  // Helper method to toggle hover effect
  toggleHoverable(hoverable: boolean): void {
    this.hoverable = hoverable;
  }

  // Helper method to toggle clickable state
  toggleClickable(clickable: boolean): void {
    this.clickable = clickable;
  }

  // Helper method to toggle border
  toggleBorder(bordered: boolean): void {
    this.bordered = bordered;
  }

  // Helper method to set router link
  setRouterLink(link: string | any[]): void {
    this.routerLink = link;
  }

  // Helper method to toggle header background
  toggleHeaderBackground(show: boolean): void {
    this.headerBackground = show;
  }

  // Helper method to toggle footer background
  toggleFooterBackground(show: boolean): void {
    this.footerBackground = show;
  }

  // Helper method to set image aspect ratio
  setImageAspectRatio(ratio: '16:9' | '1:1'): void {
    this.imageAspectRatio = ratio;
  }
}