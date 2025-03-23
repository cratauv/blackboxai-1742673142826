import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          class="mx-auto h-12 w-auto"
          src="assets/images/logo.png"
          alt="Logo"
        />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          @if (!emailSent) {
            <form class="space-y-6" (ngSubmit)="onSubmit()">
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div class="mt-1">
                  <input
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  [disabled]="isLoading"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  @if (isLoading) {
                    <i class="fas fa-spinner fa-spin mr-2"></i>
                  }
                  Send reset link
                </button>
              </div>
            </form>
          } @else {
            <!-- Success Message -->
            <div class="rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fas fa-check-circle text-green-400 text-lg"></i>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">
                    Reset link sent
                  </h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>
                      We've sent a password reset link to {{ email }}. Please check your email and follow the instructions to reset your password.
                    </p>
                  </div>
                  <div class="mt-4">
                    <button
                      type="button"
                      class="text-sm font-medium text-green-800 hover:text-green-700"
                      (click)="resendEmail()"
                    >
                      Didn't receive the email? Click here to resend
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Back to Login -->
          <div class="mt-6 text-center">
            <a
              routerLink="/auth/login"
              class="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  emailSent = false;

  onSubmit(): void {
    if (!this.email) return;

    this.isLoading = true;
    // Implement password reset logic
    console.log('Sending reset link to:', this.email);
    setTimeout(() => {
      this.isLoading = false;
      this.emailSent = true;
    }, 1500);
  }

  resendEmail(): void {
    this.isLoading = true;
    // Implement resend logic
    console.log('Resending reset link to:', this.email);
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
}