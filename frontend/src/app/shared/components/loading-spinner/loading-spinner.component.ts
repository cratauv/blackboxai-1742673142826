import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoadingService, LoadingState } from '../../../core/services/loading.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading) {
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        [@fadeInOut]="'visible'"
      >
        <div class="bg-white p-8 rounded-lg shadow-xl text-center">
          <!-- Spinner Animation -->
          <div class="inline-block">
            <div class="w-16 h-16 border-t-4 border-b-4 border-primary-600 rounded-full animate-spin"></div>
          </div>

          <!-- Loading Message -->
          @if (message) {
            <p class="mt-4 text-gray-700">{{ message }}</p>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  loading = false;
  message?: string;
  private subscription: Subscription | null = null;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe(
      (state: LoadingState) => {
        this.loading = state.isLoading;
        this.message = state.message;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}