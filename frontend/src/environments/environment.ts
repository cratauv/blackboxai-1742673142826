export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  socketUrl: 'ws://localhost:3000',
  stripePublicKey: 'pk_test_your_stripe_key',
  googleMapsApiKey: 'your_google_maps_key',
  firebase: {
    apiKey: 'your_firebase_api_key',
    authDomain: 'your-app.firebaseapp.com',
    projectId: 'your-app',
    storageBucket: 'your-app.appspot.com',
    messagingSenderId: 'your_messaging_sender_id',
    appId: 'your_app_id',
    measurementId: 'your_measurement_id'
  },
  auth: {
    tokenKey: 'token',
    userKey: 'currentUser',
    expiryKey: 'tokenExpiry',
    refreshTokenKey: 'refreshToken'
  },
  features: {
    socialLogin: true,
    emailVerification: true,
    twoFactorAuth: true,
    passwordStrengthCheck: true,
    rememberMe: true
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100
  },
  timeouts: {
    apiRequest: 30000, // 30 seconds
    tokenRefresh: 300000, // 5 minutes
    sessionIdle: 1800000 // 30 minutes
  },
  uploads: {
    maxFileSize: 5242880, // 5MB
    allowedFileTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    imageCompression: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8
    }
  },
  cache: {
    defaultTTL: 300, // 5 minutes
    products: 600, // 10 minutes
    categories: 1800, // 30 minutes
    user: 86400 // 24 hours
  },
  analytics: {
    enabled: true,
    trackingId: 'your_tracking_id',
    options: {
      anonymizeIp: true,
      sendPageView: true
    }
  },
  sentry: {
    enabled: true,
    dsn: 'your_sentry_dsn',
    environment: 'development',
    tracesSampleRate: 1.0
  },
  logging: {
    level: 'debug', // 'debug' | 'info' | 'warn' | 'error'
    console: true,
    sentry: true,
    remote: false
  },
  notifications: {
    defaultDuration: 5000,
    position: 'top-right',
    maxStack: 3,
    preventDuplicates: true
  },
  dateFormat: {
    display: 'MMM DD, YYYY',
    input: 'YYYY-MM-DD',
    api: 'ISO'
  },
  currency: {
    code: 'USD',
    symbol: '$',
    position: 'before'
  },
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    username: {
      minLength: 3,
      maxLength: 20,
      allowedChars: '^[a-zA-Z0-9_-]*$'
    }
  },
  errorMessages: {
    network: 'Please check your internet connection',
    server: 'Server error occurred. Please try again later',
    auth: {
      invalidCredentials: 'Invalid email or password',
      accountLocked: 'Your account has been locked. Please contact support',
      emailNotVerified: 'Please verify your email address'
    }
  },
  routes: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      verifyEmail: '/auth/verify-email'
    },
    app: {
      home: '/home',
      dashboard: '/dashboard',
      profile: '/profile',
      settings: '/settings'
    },
    admin: {
      dashboard: '/admin/dashboard',
      users: '/admin/users',
      products: '/admin/products',
      orders: '/admin/orders'
    }
  }
};