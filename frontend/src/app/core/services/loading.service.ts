import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { debounce, distinctUntilChanged } from 'rxjs/operators';

export interface LoadingState {
  show: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({ show: false });
  private loadingMap = new Map<string, boolean>();
  private minDisplayTime = 500; // Minimum time to show loading indicator (ms)
  private debounceTime = 200; // Debounce time for loading state changes (ms)

  // Observable for components to subscribe to
  loading$ = this.loadingSubject.asObservable().pipe(
    debounce(state => timer(state.show ? 0 : this.debounceTime)),
    distinctUntilChanged((prev, curr) => prev.show === curr.show && prev.message === curr.message)
  );

  // Start loading with optional message
  start(message?: string, key?: string): void {
    if (key) {
      this.loadingMap.set(key, true);
    }
    this.updateLoadingState(true, message);
  }

  // Stop loading for a specific key or globally
  stop(key?: string): void {
    if (key) {
      this.loadingMap.delete(key);
    }
    
    if (!key || this.loadingMap.size === 0) {
      this.updateLoadingState(false);
    }
  }

  // Update loading message
  updateMessage(message: string): void {
    const currentState = this.loadingSubject.value;
    if (currentState.show) {
      this.loadingSubject.next({ ...currentState, message });
    }
  }

  // Clear all loading states
  clear(): void {
    this.loadingMap.clear();
    this.updateLoadingState(false);
  }

  // Check if any loading state is active
  isLoading(): boolean {
    return this.loadingSubject.value.show;
  }

  // Get current loading message
  getMessage(): string | undefined {
    return this.loadingSubject.value.message;
  }

  // Get number of active loading states
  getActiveLoadingCount(): number {
    return this.loadingMap.size;
  }

  private updateLoadingState(show: boolean, message?: string): void {
    if (show) {
      // Show loading immediately
      this.loadingSubject.next({ show, message });
    } else {
      // Ensure minimum display time
      const currentState = this.loadingSubject.value;
      if (currentState.show) {
        setTimeout(() => {
          if (this.loadingMap.size === 0) {
            this.loadingSubject.next({ show: false });
          }
        }, this.minDisplayTime);
      }
    }
  }

  // Helper method to wrap async operations with loading state
  async withLoading<T>(
    operation: Promise<T> | Observable<T>,
    message?: string,
    key?: string
  ): Promise<T> {
    try {
      this.start(message, key);
      
      if (operation instanceof Promise) {
        return await operation;
      } else {
        return await operation.toPromise();
      }
    } finally {
      this.stop(key);
    }
  }

  // Helper method to create a loading key
  static createLoadingKey(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Helper method to set minimum display time
  setMinDisplayTime(time: number): void {
    this.minDisplayTime = time;
  }

  // Helper method to set debounce time
  setDebounceTime(time: number): void {
    this.debounceTime = time;
  }

  // Helper method to check if specific loading key is active
  isLoadingKey(key: string): boolean {
    return this.loadingMap.has(key);
  }

  // Helper method to get all active loading keys
  getActiveLoadingKeys(): string[] {
    return Array.from(this.loadingMap.keys());
  }

  // Helper method to update loading state with progress
  updateProgress(progress: number, message?: string): void {
    const currentState = this.loadingSubject.value;
    if (currentState.show) {
      const progressMessage = message || `Loading... ${Math.round(progress)}%`;
      this.loadingSubject.next({ ...currentState, message: progressMessage });
    }
  }

  // Helper method to handle multiple loading states
  startMultiple(keys: string[], message?: string): void {
    keys.forEach(key => this.loadingMap.set(key, true));
    this.updateLoadingState(true, message);
  }

  // Helper method to stop multiple loading states
  stopMultiple(keys: string[]): void {
    keys.forEach(key => this.loadingMap.delete(key));
    if (this.loadingMap.size === 0) {
      this.updateLoadingState(false);
    }
  }

  // Helper method to check if any critical loading state is active
  hasCriticalLoadingState(criticalKeys: string[]): boolean {
    return criticalKeys.some(key => this.loadingMap.has(key));
  }

  // Helper method to get loading state as promise
  waitForLoadingComplete(): Promise<void> {
    if (!this.isLoading()) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      const subscription = this.loading$.subscribe(state => {
        if (!state.show) {
          subscription.unsubscribe();
          resolve();
        }
      });
    });
  }
}