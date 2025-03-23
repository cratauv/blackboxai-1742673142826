import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add auth header with token if available
    const token = this.authService.token;
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }

        if (error.status === 403) {
          // Handle forbidden errors
          this.router.navigate(['/unauthorized']);
        }

        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      // Try to refresh token
      return this.authService.refreshToken().pipe(
        switchMap(response => {
          this.isRefreshing = false;
          return next.handle(this.addToken(request, response.token));
        }),
        catchError(error => {
          this.isRefreshing = false;

          // If refresh token fails, log out and redirect to login
          if (error.status === 401 || error.status === 403) {
            this.authService.logout();
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: this.router.url }
            });
          }

          return throwError(() => error);
        })
      );
    }

    // If refresh is already in progress, wait for it to complete
    return next.handle(request);
  }

  // Helper method to check if request is to auth endpoints
  private isAuthRequest(request: HttpRequest<any>): boolean {
    return request.url.includes('/auth/');
  }

  // Helper method to check if request should skip auth
  private shouldSkipAuth(request: HttpRequest<any>): boolean {
    const skipAuthEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password'
    ];
    return skipAuthEndpoints.some(endpoint => request.url.includes(endpoint));
  }

  // Helper method to handle API errors
  private handleApiError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message;
    }

    // Log error for debugging
    console.error('API Error:', {
      status: error.status,
      message: errorMessage,
      url: error.url
    });

    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }

  // Helper method to add common headers
  private addCommonHeaders(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add any other common headers
      }
    });
  }

  // Helper method to handle file uploads
  private handleFileUpload(request: HttpRequest<any>): HttpRequest<any> {
    // Remove content type for file uploads
    const headers = request.headers.delete('Content-Type');
    return request.clone({ headers });
  }

  // Helper method to add language header
  private addLanguageHeader(request: HttpRequest<any>): HttpRequest<any> {
    const language = localStorage.getItem('language') || 'en';
    return request.clone({
      setHeaders: {
        'Accept-Language': language
      }
    });
  }

  // Helper method to handle offline state
  private handleOffline(): Observable<never> {
    return throwError(() => ({
      status: 0,
      message: 'No internet connection'
    }));
  }

  // Helper method to check if device is online
  private isOnline(): boolean {
    return navigator.onLine;
  }

  // Helper method to retry failed requests
  private retryRequest(
    request: HttpRequest<any>,
    next: HttpHandler,
    retries: number = 3
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (retries > 0 && error.status !== 401 && error.status !== 403) {
          return this.retryRequest(request, next, retries - 1);
        }
        return throwError(() => error);
      })
    );
  }
}