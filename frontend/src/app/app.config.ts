import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { httpRequestInterceptor } from './core/interceptors/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router configuration
    provideRouter(
      routes,
      withViewTransitions()
    ),

    // HTTP configuration
    provideHttpClient(
      withInterceptors([httpRequestInterceptor])
    ),

    // Animations
    provideAnimations(),

    // Service Worker for PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),

    // Additional providers can be added here
    {
      provide: 'WINDOW',
      useValue: window
    },
    {
      provide: 'LOCALSTORAGE',
      useValue: localStorage
    },
    {
      provide: 'SESSIONSTORAGE',
      useValue: sessionStorage
    }
  ]
};

// Error handling configuration
export const errorHandlingConfig = {
  rethrowError: true,
  unwrapError: true,
  showDevError: isDevMode()
};

// API configuration
export const apiConfig = {
  retryCount: 3,
  retryDelay: 1000,
  timeout: 30000
};

// Cache configuration
export const cacheConfig = {
  ttl: 300000, // 5 minutes
  maxSize: 100
};

// Form configuration
export const formConfig = {
  updateOn: 'blur',
  debounceTime: 300
};

// Validation messages
export const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minlength: 'This field must be at least {0} characters long',
  maxlength: 'This field cannot be more than {0} characters long',
  pattern: 'Please enter a valid value',
  min: 'Value must be greater than or equal to {0}',
  max: 'Value must be less than or equal to {0}'
};

// Date formats
export const dateFormats = {
  display: {
    dateInput: 'MMM DD, YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
  parse: {
    dateInput: ['YYYY-MM-DD', 'MMM DD, YYYY']
  }
};

// Currency formats
export const currencyFormats = {
  USD: {
    symbol: '$',
    precision: 2,
    thousand: ',',
    decimal: '.',
    format: '%s%v'
  },
  EUR: {
    symbol: '€',
    precision: 2,
    thousand: '.',
    decimal: ',',
    format: '%v %s'
  }
};

// Animation configuration
export const animationConfig = {
  duration: 200,
  easing: 'ease-in-out'
};

// Toast configuration
export const toastConfig = {
  position: 'top-right',
  duration: 5000,
  closeButton: true,
  progressBar: true
};

// Modal configuration
export const modalConfig = {
  backdrop: true,
  keyboard: true,
  focus: true,
  size: 'md'
};

// Loading configuration
export const loadingConfig = {
  backdropClass: 'loading-backdrop',
  spinnerClass: 'loading-spinner',
  message: 'Loading...'
};

// Pagination configuration
export const paginationConfig = {
  itemsPerPage: 10,
  maxSize: 5,
  boundaryLinks: true,
  directionLinks: true,
  rotate: true
};

// Chart configuration
export const chartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    position: 'bottom',
    labels: {
      usePointStyle: true
    }
  }
};

// Grid configuration
export const gridConfig = {
  rowHeight: 50,
  headerHeight: 50,
  footerHeight: 50,
  scrollbarV: true,
  scrollbarH: true
};

// File upload configuration
export const fileUploadConfig = {
  maxFileSize: 5242880, // 5MB
  allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
  multiple: true
};

// Editor configuration
export const editorConfig = {
  height: 300,
  menubar: false,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor | \
    alignleft aligncenter alignright alignjustify | \
    bullist numlist outdent indent | removeformat | help'
};

// Color configuration
export const colorConfig = {
  primary: '#0ea5e9',
  secondary: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9'
};