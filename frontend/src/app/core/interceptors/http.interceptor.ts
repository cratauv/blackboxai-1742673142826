import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private excludedUrls: string[] = [
    '/auth/login',
    '/auth/register'
  ];

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Don't show loading for excluded URLs
    const showLoading = !this.excludedUrls.some(url => request.url.includes(url));
    
    if (showLoading) {
      this.loadingService.start();
    }

    // Add auth token if available
    const token = this.authService.authToken;
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        if (showLoading) {
          this.loadingService.stop();
        }
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error.message || 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized access';
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 422:
          errorMessage = error.error.message || 'Validation error';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = 'Something went wrong. Please try again.';
      }
    }

    // Show error notification
    this.notificationService.error(errorMessage);

    // Log error for debugging
    console.error('HTTP Error:', {
      status: error.status,
      message: errorMessage,
      error: error.error
    });
  }
}