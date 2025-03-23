export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences?: UserPreferences;
  address?: Address;
  settings?: UserSettings;
  metadata?: Record<string, any>;
}

export type UserRole = 'admin' | 'user' | 'seller' | 'support';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    showOnlineStatus: boolean;
    showLastSeen: boolean;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  type?: 'home' | 'work' | 'other';
  isDefault?: boolean;
  label?: string;
}

export interface UserSettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  autoLogout: boolean;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
}

export interface UserProfile extends Pick<User, 'firstName' | 'lastName' | 'avatar' | 'email' | 'phone'> {
  bio?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface UserStats {
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: Date;
  memberSince: Date;
  reviewsCount: number;
  averageRating?: number;
}

export interface UserActivity {
  id: string;
  type: 'login' | 'order' | 'review' | 'profile_update' | 'password_change';
  timestamp: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    city?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface UserPermissions {
  canCreateProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canManageUsers: boolean;
  canManageOrders: boolean;
  canAccessAdmin: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
}

export interface UserNotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  priceAlerts: boolean;
  stockAlerts: boolean;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start?: string;
    end?: string;
    timezone?: string;
  };
}

export interface UserSecurity {
  passwordLastChanged: Date;
  twoFactorMethod?: 'app' | 'sms' | 'email';
  backupCodes?: string[];
  trustedDevices?: {
    id: string;
    name: string;
    lastUsed: Date;
    ipAddress: string;
    userAgent: string;
  }[];
  loginHistory: {
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    success: boolean;
    failureReason?: string;
  }[];
}

// Helper functions
export const getUserFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

export const getUserInitials = (user: User): string => {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};

export const isAdmin = (user: User): boolean => {
  return user.role === 'admin';
};

export const isSeller = (user: User): boolean => {
  return user.role === 'seller';
};

export const hasPermission = (user: User, permission: keyof UserPermissions): boolean => {
  // Implement permission checking logic
  return true;
};

export const formatUserRole = (role: UserRole): string => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export const getDefaultUserPreferences = (): UserPreferences => {
  return {
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      showLastSeen: true
    }
  };
};

export const getDefaultUserSettings = (): UserSettings => {
  return {
    twoFactorEnabled: false,
    sessionTimeout: 30, // minutes
    loginNotifications: true,
    autoLogout: true,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5
  };
};