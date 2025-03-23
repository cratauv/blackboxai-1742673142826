import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'Welcome'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Protected routes
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard'
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
        title: 'Products'
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
        title: 'Orders'
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
        title: 'Shopping Cart'
      },
      {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
        title: 'Checkout'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Profile'
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings'
      }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // Error pages
  {
    path: 'not-found',
    loadComponent: () => import('./pages/error/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found'
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/error/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    title: 'Unauthorized'
  },
  {
    path: 'server-error',
    loadComponent: () => import('./pages/error/server-error/server-error.component').then(m => m.ServerErrorComponent),
    title: 'Server Error'
  },

  // Wildcard route for 404
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

// Route metadata
export const routeMetadata = {
  dashboard: {
    icon: 'fas fa-chart-line',
    description: 'View your store performance and analytics'
  },
  products: {
    icon: 'fas fa-box',
    description: 'Manage your product catalog'
  },
  orders: {
    icon: 'fas fa-shopping-cart',
    description: 'View and manage customer orders'
  },
  cart: {
    icon: 'fas fa-shopping-basket',
    description: 'Your shopping cart'
  },
  checkout: {
    icon: 'fas fa-credit-card',
    description: 'Complete your purchase'
  },
  profile: {
    icon: 'fas fa-user',
    description: 'Manage your account settings'
  },
  settings: {
    icon: 'fas fa-cog',
    description: 'Configure application settings'
  }
};

// Route guards configuration
export const guardConfig = {
  authRedirect: '/auth/login',
  adminRedirect: '/unauthorized',
  verificationRedirect: '/auth/verify-email'
};

// Route transition configuration
export const routeTransitionConfig = {
  duration: 200,
  timing: 'ease-in-out',
  animation: 'fade'
};

// Breadcrumb configuration
export const breadcrumbConfig = {
  home: {
    label: 'Home',
    path: '/'
  },
  separator: '/',
  displayHome: true
};