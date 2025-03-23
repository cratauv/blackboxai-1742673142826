import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-group">
      <!-- Label -->
      @if (label) {
        <label 
          [for]="id" 
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          {{ label }}
          @if (required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      <!-- Input Container -->
      <div class="relative">
        <!-- Icon (if provided) -->
        @if (icon) {
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i [class]="icon" class="text-gray-400"></i>
          </div>
        }

        <!-- Input Field -->
        <input
          [type]="type"
          [id]="id"
          [placeholder]="placeholder"
          [formControl]="control"
          [attr.aria-label]="label || placeholder"
          [attr.aria-invalid]="isInvalid"
          [attr.aria-describedby]="errorId"
          [class]="inputClasses"
          (blur)="onTouched()"
        />

        <!-- Password Toggle (for password fields) -->
        @if (type === 'password') {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            (click)="togglePasswordVisibility()"
          >
            <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
          </button>
        }
      </div>

      <!-- Error Message -->
      @if (isInvalid && control.errors) {
        <div [id]="errorId" class="mt-1 text-sm text-red-600" role="alert">
          @if (control.errors['required']) {
            {{ label || 'This field' }} is required
          } @else if (control.errors['email']) {
            Please enter a valid email address
          } @else if (control.errors['minlength']) {
            {{ label || 'This field' }} must be at least {{ control.errors['minlength'].requiredLength }} characters
          } @else if (control.errors['maxlength']) {
            {{ label || 'This field' }} cannot exceed {{ control.errors['maxlength'].requiredLength }} characters
          } @else if (control.errors['pattern']) {
            {{ label || 'This field' }} is invalid
          } @else if (control.errors['custom']) {
            {{ control.errors['custom'] }}
          }
        </div>
      }

      <!-- Helper Text -->
      @if (helperText && !isInvalid) {
        <p class="mt-1 text-sm text-gray-500">{{ helperText }}</p>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'tel' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() icon = '';
  @Input() helperText = '';
  @Input() required = false;
  @Input() id = `input-${Math.random().toString(36).substr(2, 9)}`;

  control = new FormControl('');
  showPassword = false;
  isDisabled = false;

  // Unique ID for error message
  errorId = `${this.id}-error`;

  // Base input classes
  private readonly baseInputClasses = `
    block w-full rounded-md 
    border-gray-300 shadow-sm
    focus:border-primary-500 focus:ring-primary-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    transition duration-150 ease-in-out
  `.trim();

  get inputClasses(): string {
    const iconPadding = this.icon ? 'pl-10' : 'pl-4';
    const passwordPadding = this.type === 'password' ? 'pr-10' : 'pr-4';
    const errorClasses = this.isInvalid ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
    
    return `
      ${this.baseInputClasses}
      ${iconPadding}
      ${passwordPadding}
      ${errorClasses}
    `.trim();
  }

  get isInvalid(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  // ControlValueAccessor methods
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.subscribe(fn);
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }
}