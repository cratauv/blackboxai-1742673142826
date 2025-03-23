import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
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
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <a
            routerLink="/auth/register"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            create a new account
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1 relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  (click)="togglePasswordVisibility()"
                >
                  <i
                    class="fas"
                    [class.fa-eye]="!showPassword"
                    [class.fa-eye-slash]="showPassword"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="rememberMe"
                  name="remember-me"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <a
                  routerLink="/auth/forgot-password"
                  class="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </a>
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
                Sign in
              </button>
            </div>
          </form>

          <!-- Social Login -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                (click)="loginWithGoogle()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <i class="fab fa-google text-lg"></i>
                <span class="ml-2">Google</span>
              </button>

              <button
                type="button"
                (click)="loginWithFacebook()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <i class="fab fa-facebook text-lg"></i>
                <span class="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.isLoading = true;
    // Implement login logic
    console.log('Logging in...', { email: this.email, rememberMe: this.rememberMe });
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  loginWithGoogle(): void {
    // Implement Google login
    console.log('Logging in with Google...');
  }

  loginWithFacebook(): void {
    // Implement Facebook login
    console.log('Logging in with Facebook...');
  }
}