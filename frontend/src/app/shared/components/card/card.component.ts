import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type CardVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="rounded-lg shadow-sm overflow-hidden"
      [class]="getContainerClasses()"
    >
      <!-- Card Header -->
      @if (showHeader) {
        <div 
          class="px-4 py-5 sm:px-6 border-b"
          [class]="getHeaderClasses()"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              @if (icon) {
                <i [class]="icon" class="mr-3 text-xl"></i>
              }
              
              <div>
                @if (title) {
                  <h3 class="text-lg font-medium leading-6">
                    {{ title }}
                  </h3>
                }
                
                @if (subtitle) {
                  <p class="mt-1 text-sm">
                    {{ subtitle }}
                  </p>
                }
              </div>
            </div>

            @if (showHeaderAction) {
              <div class="flex items-center">
                <ng-content select="[cardHeaderAction]"></ng-content>
              </div>
            }
          </div>
        </div>
      }

      <!-- Card Content -->
      <div [class]="getContentClasses()">
        <ng-content></ng-content>
      </div>

      <!-- Card Footer -->
      @if (showFooter) {
        <div 
          class="px-4 py-4 sm:px-6 border-t"
          [class]="getFooterClasses()"
        >
          <ng-content select="[cardFooter]"></ng-content>
        </div>
      }

      <!-- Loading Overlay -->
      @if (loading) {
        <div class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            <span class="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      }
    </div>
  `
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() loading = false;
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showHeaderAction = true;
  @Input() noPadding = false;
  @Input() hoverable = false;

  getContainerClasses(): string {
    const baseClasses = 'relative bg-white';
    const hoverClasses = this.hoverable ? 'transition-transform hover:scale-[1.02]' : '';
    
    return `${baseClasses} ${hoverClasses}`;
  }

  getHeaderClasses(): string {
    const baseClasses = 'bg-white';
    
    switch (this.variant) {
      case 'primary':
        return `${baseClasses} border-primary-100`;
      case 'success':
        return `${baseClasses} border-green-100`;
      case 'warning':
        return `${baseClasses} border-yellow-100`;
      case 'danger':
        return `${baseClasses} border-red-100`;
      default:
        return `${baseClasses} border-gray-200`;
    }
  }

  getContentClasses(): string {
    const paddingClasses = this.noPadding ? '' : 'px-4 py-5 sm:p-6';
    
    switch (this.variant) {
      case 'primary':
        return `${paddingClasses} bg-primary-50`;
      case 'success':
        return `${paddingClasses} bg-green-50`;
      case 'warning':
        return `${paddingClasses} bg-yellow-50`;
      case 'danger':
        return `${paddingClasses} bg-red-50`;
      default:
        return `${paddingClasses} bg-white`;
    }
  }

  getFooterClasses(): string {
    switch (this.variant) {
      case 'primary':
        return 'bg-primary-50 border-primary-100';
      case 'success':
        return 'bg-green-50 border-green-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-100';
      case 'danger':
        return 'bg-red-50 border-red-100';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }

  // Helper method to get variant-specific text color
  getTextColor(): string {
    switch (this.variant) {
      case 'primary':
        return 'text-primary-900';
      case 'success':
        return 'text-green-900';
      case 'warning':
        return 'text-yellow-900';
      case 'danger':
        return 'text-red-900';
      default:
        return 'text-gray-900';
    }
  }

  // Helper method to get variant-specific border color
  getBorderColor(): string {
    switch (this.variant) {
      case 'primary':
        return 'border-primary-200';
      case 'success':
        return 'border-green-200';
      case 'warning':
        return 'border-yellow-200';
      case 'danger':
        return 'border-red-200';
      default:
        return 'border-gray-200';
    }
  }

  // Helper method to get variant-specific icon color
  getIconColor(): string {
    switch (this.variant) {
      case 'primary':
        return 'text-primary-500';
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'danger':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  }

  // Helper method to check if card has header content
  hasHeaderContent(): boolean {
    return !!(this.title || this.subtitle || this.icon);
  }

  // Helper method to get elevation classes
  getElevation(level: 'sm' | 'md' | 'lg' = 'sm'): string {
    const elevations = {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };
    return elevations[level];
  }

  // Helper method to get rounded corner classes
  getRounded(size: 'sm' | 'md' | 'lg' = 'lg'): string {
    const corners = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg'
    };
    return corners[size];
  }
}