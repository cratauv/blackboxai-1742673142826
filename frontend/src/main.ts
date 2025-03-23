import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Bootstrap the application
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('Error bootstrapping app:', err));

// Performance monitoring
if (typeof window !== 'undefined') {
  // Report Web Vitals
  const reportWebVitals = async () => {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  };

  // Initialize performance monitoring
  reportWebVitals();

  // Track page load performance
  window.addEventListener('load', () => {
    // Navigation Timing API
    if (performance && performance.timing) {
      const timing = performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      console.log('Page Load Time:', pageLoadTime);
    }

    // Resource Timing API
    if (performance && performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource');
      console.log('Resource Timing:', resources);
    }
  });

  // Track client-side errors
  window.addEventListener('error', (event) => {
    console.error('Runtime error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
  });
}

// Environment configuration
const environment = {
  production: false,
  version: '1.0.0',
  buildDate: new Date().toISOString()
};

// Log environment info
console.log('App Version:', environment.version);
console.log('Build Date:', environment.buildDate);
console.log('Environment:', environment.production ? 'Production' : 'Development');

// Browser compatibility check
const checkBrowserCompatibility = () => {
  const requirements = {
    localStorage: !!window.localStorage,
    serviceWorker: 'serviceWorker' in navigator,
    webSocket: 'WebSocket' in window,
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    })(),
    webWorker: !!window.Worker,
    fetch: 'fetch' in window,
    promise: 'Promise' in window
  };

  const incompatibilities = Object.entries(requirements)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

  if (incompatibilities.length > 0) {
    console.warn('Browser compatibility issues:', incompatibilities);
    return false;
  }

  return true;
};

// Check browser compatibility
if (!checkBrowserCompatibility()) {
  console.warn('Some features may not work in this browser');
}

// Service Worker registration
if ('serviceWorker' in navigator && environment.production) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/ngsw-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Network status monitoring
const monitorNetworkStatus = () => {
  window.addEventListener('online', () => {
    console.log('Application is online');
  });

  window.addEventListener('offline', () => {
    console.warn('Application is offline');
  });
};

monitorNetworkStatus();

// Memory usage monitoring
const monitorMemoryUsage = () => {
  if (performance && performance.memory) {
    setInterval(() => {
      const memory = performance.memory;
      console.log('Memory Usage:', {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      });
    }, 30000); // Check every 30 seconds
  }
};

if (!environment.production) {
  monitorMemoryUsage();
}

// Debug mode configuration
const DEBUG = !environment.production;
if (DEBUG) {
  console.log('Debug mode enabled');
  // Add any debug-specific initialization
}

// Global error boundary
class ErrorBoundary {
  static handleError(error: Error): void {
    console.error('Global error caught:', error);
    // Add error reporting logic here
  }
}

// Set up global error handling
window.onerror = (message, source, lineno, colno, error) => {
  ErrorBoundary.handleError(error || new Error(message as string));
  return false;
};