import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
type InputSize = 'sm' | 'md' | 'lg';
type InputStatus = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="wrapperClasses">
      <!-- Label -->
      @if (label) {
        <label
          [for]="id"
          class="block text-sm font-medium mb-1"
          [class.text-gray-700]="!status"
          [class.text-error-700]="status === 'error'"
          [class.text-success-700]="status === 'success'"
          [class.text-warning-700]="status === 'warning'"
        >
          {{ label }}
          @if (required) {
            <span class="text-error-500">*</span>
          }
        </label>
      }

      <!-- Input Container -->
      <div class="relative">
        <!-- Prefix Icon or Text -->
        @if (prefix) {
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            @if (isIconPrefix) {
              <i [class]="prefix + ' text-gray-400'"></i>
            } @else {
              <span class="text-gray-500">{{ prefix }}</span>
            }
          </div>
        }

        <!-- Input Field -->
        <input
          [id]="id"
          [type]="type"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [min]="min"
          [max]="max"
          [minlength]="minlength"
          [maxlength]="maxlength"
          [pattern]="pattern"
          [autocomplete]="autocomplete"
          [class]="inputClasses"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        >

        <!-- Suffix Icon or Text -->
        @if (suffix) {
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            @if (isIconSuffix) {
              <i
                [class]="suffix + ' text-gray-400 cursor-pointer'"
                (click)="onSuffixClick()"
              ></i>
            } @else {
              <span class="text-gray-500">{{ suffix }}</span>
            }
          </div>
        }

        <!-- Password Toggle -->
        @if (type === 'password' && showPasswordToggle) {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            (click)="togglePasswordVisibility()"
          >
            <i
              [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
              class="text-gray-400 hover:text-gray-600"
            ></i>
          </button>
        }

        <!-- Clear Button -->
        @if (showClear && value && !disabled && !readonly) {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            (click)="clear()"
          >
            <i class="fas fa-times-circle text-gray-400 hover:text-gray-600"></i>
          </button>
        }
      </div>

      <!-- Helper Text -->
      @if (helperText) {
        <p
          class="mt-1 text-sm"
          [class.text-gray-500]="!status"
          [class.text-error-600]="status === 'error'"
          [class.text-success-600]="status === 'success'"
          [class.text-warning-600]="status === 'warning'"
        >
          {{ helperText }}
        </p>
      }

      <!-- Character Count -->
      @if (showCharCount && maxlength) {
        <div class="mt-1 text-right text-sm text-gray-500">
          {{ value?.length || 0 }}/{{ maxlength }}
        </div>
      }
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() type: InputType = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() size: InputSize = 'md';
  @Input() status?: InputStatus;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() min?: number | string;
  @Input() max?: number | string;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() pattern?: string;
  @Input() autocomplete = 'off';
  @Input() helperText = '';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() showPasswordToggle = true;
  @Input() showClear = false;
  @Input() showCharCount = false;
  @Input() fullWidth = false;

  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
  @Output() suffixClick = new EventEmitter<void>();
  @Output() cleared = new EventEmitter<void>();

  value: string = '';
  showPassword = false;
  touched = false;
  isIconPrefix = false;
  isIconSuffix = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.isIconPrefix = this.prefix?.startsWith('fa-');
    this.isIconSuffix = this.suffix?.startsWith('fa-');
  }

  get wrapperClasses(): string {
    return this.fullWidth ? 'w-full' : '';
  }

  get inputClasses(): string {
    const classes = [
      'block rounded-md shadow-sm',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      this.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
      this.readonly ? 'bg-gray-50' : '',
      this.getStatusClasses(),
      this.getSizeClasses(),
      this.getPaddingClasses(),
      this.fullWidth ? 'w-full' : ''
    ];

    return classes.filter(Boolean).join(' ');
  }

  private getStatusClasses(): string {
    const baseClasses = {
      default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
      error: 'border-error-300 focus:border-error-500 focus:ring-error-500',
      success: 'border-success-300 focus:border-success-500 focus:ring-success-500',
      warning: 'border-warning-300 focus:border-warning-500 focus:ring-warning-500'
    };

    return this.status ? baseClasses[this.status] : baseClasses.default;
  }

  private getSizeClasses(): string {
    return {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-2.5 text-lg'
    }[this.size];
  }

  private getPaddingClasses(): string {
    const hasPrefix = !!this.prefix;
    const hasSuffix = !!this.suffix || (this.type === 'password' && this.showPasswordToggle) || this.showClear;

    return `${hasPrefix ? 'pl-10' : ''} ${hasSuffix ? 'pr-10' : ''}`;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }

  onSuffixClick(): void {
    if (this.isIconSuffix) {
      this.suffixClick.emit();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }

  clear(): void {
    this.value = '';
    this.onChange('');
    this.cleared.emit();
  }

  // Helper method to set value programmatically
  setValue(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  // Helper method to set status
  setStatus(status?: InputStatus): void {
    this.status = status;
  }

  // Helper method to set helper text
  setHelperText(text: string): void {
    this.helperText = text;
  }

  // Helper method to focus input
  focusInput(): void {
    const input = document.getElementById(this.id) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  // Helper method to select all text
  selectAll(): void {
    const input = document.getElementById(this.id) as HTMLInputElement;
    if (input) {
      input.select();
    }
  }

  // Helper method to check validity
  isValid(): boolean {
    const input = document.getElementById(this.id) as HTMLInputElement;
    return input ? input.checkValidity() : true;
  }
}