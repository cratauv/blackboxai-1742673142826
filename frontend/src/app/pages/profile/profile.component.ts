import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  company?: string;
  role: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    twoFactor: boolean;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900">Profile Settings</h1>

        <!-- Profile Form -->
        <div class="mt-6">
          <div class="bg-white shadow rounded-lg">
            <!-- Avatar Section -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  @if (profile.avatar) {
                    <img
                      [src]="profile.avatar"
                      [alt]="profile.firstName"
                      class="h-24 w-24 rounded-full object-cover"
                    />
                  } @else {
                    <div class="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                      <span class="text-2xl font-medium text-primary-600">
                        {{ getInitials() }}
                      </span>
                    </div>
                  }
                </div>
                <div class="ml-6">
                  <h3 class="text-lg font-medium text-gray-900">Profile Photo</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Update your profile photo
                  </p>
                  <div class="mt-4 flex space-x-3">
                    <button
                      type="button"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Upload Photo
                    </button>
                    @if (profile.avatar) {
                      <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Personal Information -->
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
              <p class="mt-1 text-sm text-gray-500">
                Update your personal information
              </p>
              <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    [(ngModel)]="profile.firstName"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    [(ngModel)]="profile.lastName"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    [(ngModel)]="profile.email"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    [(ngModel)]="profile.phone"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    [(ngModel)]="profile.company"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    [(ngModel)]="profile.role"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    disabled
                  />
                </div>
              </div>
            </div>

            <!-- Address -->
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Address</h3>
              <p class="mt-1 text-sm text-gray-500">
                Update your shipping address
              </p>
              <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-6">
                  <label class="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    [(ngModel)]="profile.address!.street"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    [(ngModel)]="profile.address!.city"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    [(ngModel)]="profile.address!.state"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    [(ngModel)]="profile.address!.zip"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div class="sm:col-span-3">
                  <label class="block text-sm font-medium text-gray-700">Country</label>
                  <select
                    [(ngModel)]="profile.address!.country"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Preferences -->
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">Preferences</h3>
              <p class="mt-1 text-sm text-gray-500">
                Manage your notification preferences
              </p>
              <div class="mt-6 space-y-6">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      [(ngModel)]="profile.preferences.notifications"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p class="text-sm text-gray-500">Receive notifications about your account</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      [(ngModel)]="profile.preferences.newsletter"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">Newsletter</label>
                    <p class="text-sm text-gray-500">Receive our newsletter with updates and offers</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      [(ngModel)]="profile.preferences.twoFactor"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label class="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                    <p class="text-sm text-gray-500">Enable two-factor authentication for added security</p>
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
                  (click)="saveProfile()"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  profile: UserProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    company: 'Acme Inc.',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'US'
    },
    preferences: {
      notifications: true,
      newsletter: false,
      twoFactor: true
    }
  };

  getInitials(): string {
    return `${this.profile.firstName[0]}${this.profile.lastName[0]}`;
  }

  saveProfile(): void {
    // Implement save functionality
    console.log('Saving profile:', this.profile);
  }
}