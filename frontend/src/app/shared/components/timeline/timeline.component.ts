import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: Date | string;
  icon?: string;
  status?: 'completed' | 'current' | 'pending' | 'error';
  metadata?: { [key: string]: any };
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flow-root">
      <ul role="list" [class."-mb-8"]="!isLastItem(items.length - 1)">
        @for (item of items; track item.id; let index = $index) {
          <li>
            <div class="relative pb-8">
              <!-- Connector Line -->
              @if (!isLastItem(index)) {
                <span
                  class="absolute left-4 top-4 -ml-px h-full w-0.5"
                  [ngClass]="getConnectorClasses(item)"
                  aria-hidden="true"
                ></span>
              }

              <div class="relative flex space-x-3">
                <!-- Icon/Status Indicator -->
                <div>
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-full"
                    [ngClass]="getStatusClasses(item)"
                  >
                    @if (item.icon) {
                      <i [class]="item.icon" class="h-5 w-5"></i>
                    } @else {
                      @switch (item.status) {
                        @case ('completed') {
                          <i class="fas fa-check"></i>
                        }
                        @case ('current') {
                          <i class="fas fa-clock"></i>
                        }
                        @case ('error') {
                          <i class="fas fa-exclamation"></i>
                        }
                        @default {
                          <i class="fas fa-circle text-xs"></i>
                        }
                      }
                    }
                  </span>
                </div>

                <!-- Content -->
                <div class="flex min-w-0 flex-1 justify-between space-x-4">
                  <div>
                    <!-- Title -->
                    <p 
                      class="text-sm font-medium"
                      [class]="getTitleClasses(item)"
                    >
                      {{ item.title }}
                    </p>

                    <!-- Description -->
                    @if (item.description) {
                      <p class="mt-1 text-sm text-gray-500">
                        {{ item.description }}
                      </p>
                    }

                    <!-- Metadata -->
                    @if (item.metadata && showMetadata) {
                      <div class="mt-2">
                        @for (key of getMetadataKeys(item); track key) {
                          <div class="flex items-center text-sm text-gray-500">
                            <span class="font-medium text-gray-600">{{ formatMetadataKey(key) }}:</span>
                            <span class="ml-1">{{ item.metadata[key] }}</span>
                          </div>
                        }
                      </div>
                    }
                  </div>

                  <!-- Date -->
                  @if (item.date) {
                    <div class="whitespace-nowrap text-right text-sm text-gray-500">
                      {{ formatDate(item.date) }}
                    </div>
                  }
                </div>
              </div>
            </div>
          </li>
        }
      </ul>
    </div>
  `
})
export class TimelineComponent {
  @Input() items: TimelineItem[] = [];
  @Input() showMetadata = true;
  @Input() dateFormat: 'relative' | 'absolute' = 'relative';

  isLastItem(index: number): boolean {
    return index === this.items.length - 1;
  }

  getStatusClasses(item: TimelineItem): string {
    const baseClasses = 'ring-2';
    
    switch (item.status) {
      case 'completed':
        return `${baseClasses} bg-green-500 ring-green-500/20 text-white`;
      case 'current':
        return `${baseClasses} bg-blue-500 ring-blue-500/20 text-white`;
      case 'error':
        return `${baseClasses} bg-red-500 ring-red-500/20 text-white`;
      default:
        return `${baseClasses} bg-gray-200 ring-gray-200/20 text-gray-500`;
    }
  }

  getConnectorClasses(item: TimelineItem): string {
    switch (item.status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-200';
    }
  }

  getTitleClasses(item: TimelineItem): string {
    switch (item.status) {
      case 'completed':
        return 'text-green-800';
      case 'current':
        return 'text-blue-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (this.dateFormat === 'relative') {
      return this.getRelativeTime(dateObj);
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMetadataKeys(item: TimelineItem): string[] {
    return item.metadata ? Object.keys(item.metadata) : [];
  }

  formatMetadataKey(key: string): string {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
  }

  // Helper method to get current status
  getCurrentStatus(): TimelineItem | undefined {
    return this.items.find(item => item.status === 'current');
  }

  // Helper method to get completed items
  getCompletedItems(): TimelineItem[] {
    return this.items.filter(item => item.status === 'completed');
  }

  // Helper method to get pending items
  getPendingItems(): TimelineItem[] {
    return this.items.filter(item => item.status === 'pending');
  }

  // Helper method to get error items
  getErrorItems(): TimelineItem[] {
    return this.items.filter(item => item.status === 'error');
  }

  // Helper method to check if timeline is complete
  isComplete(): boolean {
    return this.items.every(item => item.status === 'completed');
  }

  // Helper method to get progress percentage
  getProgress(): number {
    const completed = this.getCompletedItems().length;
    return (completed / this.items.length) * 100;
  }
}