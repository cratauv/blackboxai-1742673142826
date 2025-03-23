import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated) {
      // Check if token is expired
      if (this.authService.isTokenExpired()) {
        this.authService.logout();
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: this.router.url }
        });
        return false;
      }
      return true;
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url }
    });
    return false;
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }

  // Additional guard methods for specific roles
  canActivateAdmin(): boolean {
    return this.canActivate() && this.authService.hasRole('admin');
  }

  canActivateVerified(): boolean {
    return this.canActivate() && this.authService.isEmailVerified();
  }

  // Helper method to check multiple roles
  hasAnyRole(roles: string[]): boolean {
    return this.canActivate() && roles.some(role => this.authService.hasRole(role));
  }

  // Helper method to redirect based on role
  redirectBasedOnRole(): void {
    const user = this.authService.currentUser;
    if (!user) return;

    switch (user.role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'seller':
        this.router.navigate(['/seller/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }

  // Helper method to handle unauthorized access
  handleUnauthorized(): void {
    this.router.navigate(['/unauthorized']);
  }

  // Helper method to check if route requires verification
  requiresVerification(route: any): boolean {
    return route.data?.requiresVerification ?? false;
  }

  // Helper method to handle unverified users
  handleUnverified(): void {
    this.router.navigate(['/auth/verify-email']);
  }
}