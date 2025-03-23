import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  if (authService.isLoggedIn) {
    return true;
  }

  // Store the attempted URL for redirecting
  const currentUrl = state.url;
  
  // Show notification
  notificationService.warning('Please log in to access this page');
  
  // Navigate to login page with return url
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: currentUrl }
  });

  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  if (authService.isLoggedIn && authService.isAdmin) {
    return true;
  }

  if (!authService.isLoggedIn) {
    // Store the attempted URL for redirecting
    const currentUrl = state.url;
    
    // Show notification
    notificationService.warning('Please log in to access this page');
    
    // Navigate to login page with return url
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: currentUrl }
    });
  } else {
    // User is logged in but not an admin
    notificationService.error('Access denied. Admin privileges required.');
    router.navigate(['/']);
  }

  return false;
};

// Guard to prevent authenticated users from accessing auth pages (login/register)
export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn) {
    return true;
  }

  // If user is already logged in, redirect to home page
  router.navigate(['/']);
  return false;
};