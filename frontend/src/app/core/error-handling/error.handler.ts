import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../../environments/environment';

interface ErrorWithStack {
  message: string;
  stack?: string;
  status?: number;
  statusText?: string;
  url?: string;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private notificationService: NotificationService,
    private ngZone: NgZone
  ) {}

  handleError(error: Error | HttpErrorResponse): void {
    let errorToHandle: ErrorWithStack = {
      message: 'An unknown error occurred'
    };

    if (error instanceof HttpErrorResponse) {
      // Handle HTTP errors
      errorToHandle = this.handleHttpError(error);
    } else if (error instanceof Error) {
      // Handle runtime errors
      errorToHandle = this.handleRuntimeError(error);
    }

    // Log error
    this.logError(errorToHandle);

    // Show user-friendly notification
    this.showErrorNotification(errorToHandle);

    // Report error to monitoring service if in production
    if (environment.production) {
      this.reportError(errorToHandle);
    }
  }

  private handleHttpError(error: HttpErrorResponse): ErrorWithStack {
    let message: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      message = error.error.message;
    } else {
      // Server-side error
      message = this.getServerErrorMessage(error);
    }

    return {
      message,
      status: error.status,
      statusText: error.statusText,
      url: error.url || undefined
    };
  }

  private handleRuntimeError(error: Error): ErrorWithStack {
    return {
      message: error.message,
      stack: error.stack
    };
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return this.handleBadRequest(error);
      case 401:
        return 'You are not authorized to access this resource';
      case 403:
        return 'You do not have permission to access this resource';
      case 404:
        return 'The requested resource was not found';
      case 422:
        return this.handleValidationError(error);
      case 429:
        return 'Too many requests. Please try again later';
      case 500:
        return 'An internal server error occurred';
      case 503:
        return 'Service temporarily unavailable';
      default:
        return 'An unexpected error occurred';
    }
  }

  private handleBadRequest(error: HttpErrorResponse): string {
    if (error.error?.errors) {
      // Handle validation errors
      const validationErrors = Object.values(error.error.errors);
      return validationErrors.join('. ');
    }
    return error.error?.message || 'Invalid request';
  }

  private handleValidationError(error: HttpErrorResponse): string {
    if (error.error?.errors) {
      const validationErrors = Object.entries(error.error.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      return `Validation failed: ${validationErrors}`;
    }
    return 'Invalid data provided';
  }

  private logError(error: ErrorWithStack): void {
    // Log to console in development
    if (!environment.production) {
      console.group('Error Details');
      console.error('Message:', error.message);
      if (error.stack) console.error('Stack:', error.stack);
      if (error.status) console.error('Status:', error.status);
      if (error.url) console.error('URL:', error.url);
      console.groupEnd();
    }
  }

  private showErrorNotification(error: ErrorWithStack): void {
    // Show error notification in NgZone to trigger change detection
    this.ngZone.run(() => {
      const message = this.getNotificationMessage(error);
      this.notificationService.error(message);
    });
  }

  private getNotificationMessage(error: ErrorWithStack): string {
    // Return user-friendly message based on environment
    if (environment.production) {
      return this.getProductionErrorMessage(error);
    }
    return this.getDevelopmentErrorMessage(error);
  }

  private getProductionErrorMessage(error: ErrorWithStack): string {
    // Generic messages for production
    if (error.status) {
      return this.getServerErrorMessage({ status: error.status } as HttpErrorResponse);
    }
    return 'An error occurred. Please try again later.';
  }

  private getDevelopmentErrorMessage(error: ErrorWithStack): string {
    // Detailed messages for development
    return error.message;
  }

  private reportError(error: ErrorWithStack): void {
    // Implement error reporting service integration
    // Example: Sentry, LogRocket, etc.
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        status: error.status,
        url: error.url
      },
      user: this.getCurrentUser(),
      browser: this.getBrowserInfo(),
      location: window.location.href
    };

    // Send to error reporting service
    console.log('Error report:', errorReport);
  }

  private getCurrentUser(): any {
    // Get current user info from auth service
    try {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        return {
          id: user.id,
          email: user.email
        };
      }
    } catch (e) {
      console.error('Error getting current user:', e);
    }
    return null;
  }

  private getBrowserInfo(): any {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      vendor: navigator.vendor
    };
  }

  // Helper method to check if error is critical
  isCriticalError(error: Error | HttpErrorResponse): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status >= 500;
    }
    return true;
  }

  // Helper method to format error for logging
  formatErrorForLogging(error: Error | HttpErrorResponse): string {
    const errorDetails = [];
    
    if (error instanceof HttpErrorResponse) {
      errorDetails.push(`Status: ${error.status}`);
      errorDetails.push(`URL: ${error.url}`);
      errorDetails.push(`Message: ${error.message}`);
    } else {
      errorDetails.push(`Type: ${error.name}`);
      errorDetails.push(`Message: ${error.message}`);
      errorDetails.push(`Stack: ${error.stack}`);
    }

    return errorDetails.join('\n');
  }

  // Helper method to handle network errors
  handleNetworkError(error: Error): void {
    this.notificationService.error('Network connection error. Please check your internet connection.');
  }

  // Helper method to handle authentication errors
  handleAuthError(error: HttpErrorResponse): void {
    this.notificationService.error('Authentication error. Please log in again.');
    // Redirect to login page or refresh token
  }

  // Helper method to handle API errors
  handleApiError(error: HttpErrorResponse): void {
    const message = error.error?.message || 'API error occurred';
    this.notificationService.error(message);
  }
}