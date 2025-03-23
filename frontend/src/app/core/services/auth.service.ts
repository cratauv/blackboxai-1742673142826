import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  isEmailVerified: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load user and token from localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.tokenSubject.next(storedToken);
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser && !!this.token;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  register(user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, user)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Registration error:', error);
          throw error;
        })
      );
  }

  logout(): void {
    // Clear user data from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    // Clear BehaviorSubjects
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);

    // Navigate to login page
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/forgot-password`, { email })
      .pipe(
        catchError(error => {
          console.error('Forgot password error:', error);
          throw error;
        })
      );
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/reset-password`, {
      token,
      newPassword
    }).pipe(
      catchError(error => {
        console.error('Reset password error:', error);
        throw error;
      })
    );
  }

  verifyEmail(token: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/verify-email`, { token })
      .pipe(
        catchError(error => {
          console.error('Email verification error:', error);
          throw error;
        })
      );
  }

  resendVerificationEmail(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/resend-verification`, {})
      .pipe(
        catchError(error => {
          console.error('Resend verification error:', error);
          throw error;
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh-token`, {})
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Token refresh error:', error);
          // If refresh token fails, log out the user
          this.logout();
          throw error;
        })
      );
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/auth/profile`, updates)
      .pipe(
        tap(user => {
          const currentUser = this.currentUser;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...user };
            this.currentUserSubject.next(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        }),
        catchError(error => {
          console.error('Profile update error:', error);
          throw error;
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      catchError(error => {
        console.error('Password change error:', error);
        throw error;
      })
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    // Store user details and token in localStorage
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);

    // Update BehaviorSubjects
    this.currentUserSubject.next(response.user);
    this.tokenSubject.next(response.token);
  }

  // Helper method to check if user has specific role
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Helper method to check if user's email is verified
  isEmailVerified(): boolean {
    return this.currentUser?.isEmailVerified ?? false;
  }

  // Helper method to get user's full name
  getFullName(): string {
    const user = this.currentUser;
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  // Helper method to check token expiration
  isTokenExpired(): boolean {
    const token = this.token;
    if (!token) return true;

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return tokenData.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Token parsing error:', error);
      return true;
    }
  }
}