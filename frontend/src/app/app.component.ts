import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { LoadingService } from './core/services/loading.service';
import { NotificationService } from './core/services/notification.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    NotificationComponent
  ],
  template: `
    <!-- Loading Spinner -->
    @if (isLoading$ | async) {
      <app-loading-spinner></app-loading-spinner>
    }

    <!-- Notifications -->
    <app-notification></app-notification>

    <!-- Main Layout -->
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      @if (showHeader) {
        <app-header
          [user]="currentUser$ | async"
          (logout)="onLogout()"
        ></app-header>
      }

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      @if (showFooter) {
        <app-footer></app-footer>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .min-h-screen {
      min-height: 100vh;
    }

    main {
      padding-top: var(--header-height, 64px);
      padding-bottom: var(--footer-height, 64px);
    }

    @media (max-width: 768px) {
      main {
        padding-top: var(--header-height-mobile, 56px);
        padding-bottom: var(--footer-height-mobile, 56px);
      }
    }
  `]
})
export class AppComponent implements OnInit {
  isLoading$ = this.loadingService.isLoading$;
  currentUser$ = this.authService.currentUser$;
  showHeader = true;
  showFooter = true;

  constructor(
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize app
    this.initializeApp();

    // Subscribe to route changes to update layout
    this.handleRouteChanges();

    // Handle authentication state
    this.handleAuthState();

    // Handle app errors
    this.handleAppErrors();
  }

  private initializeApp(): void {
    // Check for stored auth token
    const token = localStorage.getItem('token');
    if (token) {
      // Validate and refresh token
      this.authService.refreshToken().subscribe({
        error: () => this.authService.logout()
      });
    }

    // Initialize theme
    this.initializeTheme();

    // Check for app updates
    this.checkForUpdates();
  }

  private handleRouteChanges(): void {
    // Update header/footer visibility based on route
    // Subscribe to router events and update layout accordingly
  }

  private handleAuthState(): void {
    // Handle authentication state changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // User is logged in
        // Initialize user-specific features
      } else {
        // User is logged out
        // Clean up user-specific data
      }
    });
  }

  private handleAppErrors(): void {
    // Global error handling
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global error:', { message, source, lineno, colno, error });
      this.notificationService.error('An unexpected error occurred');
      return false;
    };

    window.onunhandledrejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.notificationService.error('An unexpected error occurred');
    };
  }

  private initializeTheme(): void {
    // Check for stored theme preference
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  private checkForUpdates(): void {
    // Check for new version of the app
    // Show update notification if available
  }

  onLogout(): void {
    this.authService.logout();
  }

  // Helper method to toggle theme
  toggleTheme(): void {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // Helper method to toggle header
  toggleHeader(show: boolean): void {
    this.showHeader = show;
  }

  // Helper method to toggle footer
  toggleFooter(show: boolean): void {
    this.showFooter = show;
  }

  // Helper method to show maintenance mode
  showMaintenanceMode(): void {
    this.notificationService.warning('System maintenance in progress');
  }

  // Helper method to check browser compatibility
  checkBrowserCompatibility(): boolean {
    // Add browser compatibility checks
    return true;
  }

  // Helper method to handle network status
  handleNetworkStatus(): void {
    window.addEventListener('online', () => {
      this.notificationService.success('Back online');
    });

    window.addEventListener('offline', () => {
      this.notificationService.warning('No internet connection');
    });
  }
}