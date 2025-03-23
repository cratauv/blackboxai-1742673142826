import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({
    isLoading: false
  });

  loading$: Observable<LoadingState> = this.loadingSubject.asObservable();

  private loadingCount = 0;

  /**
   * Start loading with an optional message
   * @param message Optional loading message to display
   */
  start(message?: string): void {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.loadingSubject.next({
        isLoading: true,
        message
      });
    }
  }

  /**
   * Stop loading
   */
  stop(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loadingSubject.next({
        isLoading: false
      });
    }
  }

  /**
   * Clear all loading states
   */
  clear(): void {
    this.loadingCount = 0;
    this.loadingSubject.next({
      isLoading: false
    });
  }

  /**
   * Get current loading state
   */
  get isLoading(): boolean {
    return this.loadingSubject.value.isLoading;
  }

  /**
   * Get current loading message
   */
  get message(): string | undefined {
    return this.loadingSubject.value.message;
  }

  /**
   * Wrap an async operation with loading state
   * @param operation Async operation to wrap
   * @param message Optional loading message
   */
  async wrapLoading<T>(operation: Promise<T>, message?: string): Promise<T> {
    try {
      this.start(message);
      const result = await operation;
      return result;
    } finally {
      this.stop();
    }
  }
}