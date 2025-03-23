import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Settings {
  general: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
    passwordExpiry: number;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
    animationsEnabled: boolean;
    showTips: boolean;
  };
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>

        <!-- Settings Navigation -->
        <div class="mt-6 bg-white rounded-lg shadow">
          <div class="divide-y divide-gray-200">
            <!-- General Settings -->
            <div class="p-6">
              <h2 class="text-lg font-medium text-gray-900">General Settings</h2>
              <p class="mt-1 text-sm text-gray-500">
                Configure your basic application preferences
              </p>
              <div class="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Language</label>
                  <select
                    [(ngModel)]="settings.general.language"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    [(ngModel)]="settings.general.timezone"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="CST">Central Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Date Format</label>
                  <select
                    [(ngModel)]="settings.general.dateFormat"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Currency</label>
                  <select
                    [(ngModel)]="settings.general.currency"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Notification Settings -->
            <div class="p-6">
              <h2 class="text-lg font-medium text-gray-900">Notifications</h2>
              <p class="mt-1 text-sm text-gray-500">
                Manage your notification preferences
              </p>
              <div class="mt-6 space-y-6">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      [(ngModel)]="settings.notifications.email"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p class="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      [(ngModel)]="settings.notifications.push"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">Push Notifications</label>
                    <p class="text-sm text-gray-500">Receive push notifications in your browser</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      [(ngModel)]="settings.notifications.orderUpdates"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">Order Updates</label>
                    <p class="text-sm text-gray-500">Get notified about order status changes</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security Settings -->
            <div class="p-6">
              <h2 class="text-lg font-medium text-gray-900">Security</h2>
              <p class="mt-1 text-sm text-gray-500">
                Configure your security preferences
              </p>
              <div class="mt-6 space-y-6">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      [(ngModel)]="settings.security.twoFactorAuth"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                    <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    [(ngModel)]="settings.security.sessionTimeout"
                    min="5"
                    max="120"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Display Settings -->
            <div class="p-6">
              <h2 class="text-lg font-medium text-gray-900">Display</h2>
              <p class="mt-1 text-sm text-gray-500">
                Customize your display preferences
              </p>
              <div class="mt-6 space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Theme</label>
                  <select
                    [(ngModel)]="settings.display.theme"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      [(ngModel)]="settings.display.compactMode"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">Compact Mode</label>
                    <p class="text-sm text-gray-500">Use a more compact layout</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      [(ngModel)]="settings.display.animationsEnabled"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">Enable Animations</label>
                    <p class="text-sm text-gray-500">Show animations throughout the application</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="px-6 py-4 bg-gray-50 rounded-b-lg">
            <div class="flex justify-end">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                (click)="saveSettings()"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  settings: Settings = {
    general: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      orderUpdates: true,
      promotions: false,
      newsletter: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginNotifications: true,
      passwordExpiry: 90
    },
    display: {
      theme: 'light',
      compactMode: false,
      animationsEnabled: true,
      showTips: true
    }
  };

  saveSettings(): void {
    // Implement save functionality
    console.log('Saving settings:', this.settings);
  }
}