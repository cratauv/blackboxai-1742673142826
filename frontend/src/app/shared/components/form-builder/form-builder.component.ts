import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ label: string; value: any }>;
  validators?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    email?: boolean;
  };
  hint?: string;
  errorMessages?: { [key: string]: string };
}

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
      @for (field of fields; track field.key) {
        <div [class]="getFieldWrapperClasses(field)">
          <!-- Label -->
          <label [for]="field.key" class="block text-sm font-medium text-gray-700">
            {{ field.label }}
            @if (field.required) {
              <span class="text-red-500">*</span>
            }
          </label>

          <!-- Field Input -->
          <div class="mt-1">
            @switch (field.type) {
              @case ('textarea') {
                <textarea
                  [id]="field.key"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  rows="4"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  [class.border-red-300]="isFieldInvalid(field.key)"
                ></textarea>
              }
              @case ('select') {
                <select
                  [id]="field.key"
                  [formControlName]="field.key"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  [class.border-red-300]="isFieldInvalid(field.key)"
                >
                  <option value="">Select {{ field.label }}</option>
                  @for (option of field.options; track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              }
              @case ('radio') {
                <div class="space-y-2">
                  @for (option of field.options; track option.value) {
                    <div class="flex items-center">
                      <input
                        type="radio"
                        [id]="field.key + '_' + option.value"
                        [formControlName]="field.key"
                        [value]="option.value"
                        class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label
                        [for]="field.key + '_' + option.value"
                        class="ml-3 block text-sm text-gray-700"
                      >
                        {{ option.label }}
                      </label>
                    </div>
                  }
                </div>
              }
              @case ('checkbox') {
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    [id]="field.key"
                    [formControlName]="field.key"
                    class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  @if (field.hint) {
                    <span class="ml-3 text-sm text-gray-500">{{ field.hint }}</span>
                  }
                </div>
              }
              @default {
                <input
                  [type]="field.type"
                  [id]="field.key"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  [class.border-red-300]="isFieldInvalid(field.key)"
                />
              }
            }
          </div>

          <!-- Field Hint -->
          @if (field.hint && field.type !== 'checkbox') {
            <p class="mt-2 text-sm text-gray-500">{{ field.hint }}</p>
          }

          <!-- Field Errors -->
          @if (isFieldInvalid(field.key)) {
            <p class="mt-2 text-sm text-red-600">
              {{ getErrorMessage(field) }}
            </p>
          }
        </div>
      }

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-3">
        @if (showReset) {
          <button
            type="button"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            (click)="resetForm()"
          >
            Reset
          </button>
        }
        <button
          type="submit"
          [disabled]="!form.valid || form.pristine"
          class="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitLabel }}
        </button>
      </div>
    </form>
  `
})
export class FormBuilderComponent {
  @Input() fields: FormField[] = [];
  @Input() submitLabel = 'Submit';
  @Input() showReset = true;
  @Input() initialValues: { [key: string]: any } = {};

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();
  @Output() formValueChanges = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.valueChanges.subscribe(values => {
      this.formValueChanges.emit(values);
    });
  }

  private buildForm(): void {
    const group: { [key: string]: any } = {};

    this.fields.forEach(field => {
      const validators = this.getValidators(field);
      const initialValue = this.initialValues[field.key] ?? field.defaultValue ?? '';
      
      group[field.key] = [{ 
        value: initialValue, 
        disabled: field.disabled 
      }, validators];
    });

    this.form = this.fb.group(group);
  }

  private getValidators(field: FormField): any[] {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validators) {
      if (field.validators.min !== undefined) {
        validators.push(Validators.min(field.validators.min));
      }
      if (field.validators.max !== undefined) {
        validators.push(Validators.max(field.validators.max));
      }
      if (field.validators.minLength !== undefined) {
        validators.push(Validators.minLength(field.validators.minLength));
      }
      if (field.validators.maxLength !== undefined) {
        validators.push(Validators.maxLength(field.validators.maxLength));
      }
      if (field.validators.pattern) {
        validators.push(Validators.pattern(field.validators.pattern));
      }
      if (field.validators.email) {
        validators.push(Validators.email);
      }
    }

    return validators;
  }

  isFieldInvalid(fieldKey: string): boolean {
    const control = this.form.get(fieldKey);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  getErrorMessage(field: FormField): string {
    const control = this.form.get(field.key);
    if (!control?.errors) return '';

    const errorKey = Object.keys(control.errors)[0];
    if (field.errorMessages?.[errorKey]) {
      return field.errorMessages[errorKey];
    }

    switch (errorKey) {
      case 'required':
        return `${field.label} is required`;
      case 'email':
        return 'Please enter a valid email address';
      case 'min':
        return `Value must be at least ${field.validators?.min}`;
      case 'max':
        return `Value must be at most ${field.validators?.max}`;
      case 'minlength':
        return `Must be at least ${field.validators?.minLength} characters`;
      case 'maxlength':
        return `Must be at most ${field.validators?.maxLength} characters`;
      case 'pattern':
        return `Please enter a valid value`;
      default:
        return 'This field is invalid';
    }
  }

  getFieldWrapperClasses(field: FormField): string {
    return field.type === 'checkbox' ? 'relative flex items-start' : 'space-y-1';
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  resetForm(): void {
    this.form.reset(this.initialValues);
    this.formReset.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper method to patch form values
  patchValue(values: { [key: string]: any }): void {
    this.form.patchValue(values);
  }

  // Helper method to reset specific fields
  resetField(fieldKey: string): void {
    const control = this.form.get(fieldKey);
    if (control) {
      control.reset(this.initialValues[fieldKey]);
    }
  }

  // Helper method to disable/enable specific fields
  setFieldState(fieldKey: string, disabled: boolean): void {
    const control = this.form.get(fieldKey);
    if (control) {
      disabled ? control.disable() : control.enable();
    }
  }

  // Helper method to get form values
  getValues(): any {
    return this.form.value;
  }

  // Helper method to check form validity
  isValid(): boolean {
    return this.form.valid;
  }

  // Helper method to check if form is pristine
  isPristine(): boolean {
    return this.form.pristine;
  }

  // Helper method to check if form is dirty
  isDirty(): boolean {
    return this.form.dirty;
  }
}