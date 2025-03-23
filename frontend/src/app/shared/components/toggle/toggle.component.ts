import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ToggleSize = 'sm' | 'md' | 'lg';
type ToggleType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label
      class="inline-flex items-center"
      [class.cursor-pointer]="!disabled"
      [class.opacity-50]="disabled"
    >
      <!-- Toggle Switch -->
      <div
        class="relative"
        [class]="getToggleContainerClasses()"
      >
        <!-- Input -->
        <input
          type="checkbox"
          class="sr-only"
          [id]="id"
          [checked]="checked"
          [disabled]="disabled"
          (change)="onToggle($event)"
        />

        <!-- Track -->
        <div
          class="block rounded-full transition-colors duration-200"
          [class]="getTrackClasses()"
        ></div>

        <!-- Thumb -->
        <div
          class="absolute rounded-full transform transition-transform duration-200 flex items-center justify-center"
          [class]="getThumbClasses()"
        >
          <!-- Icon -->
          @if (checked && checkedIcon) {
            <i [class]="checkedIcon" [class]="getIconClasses()"></i>
          }
          @if (!checked && uncheckedIcon) {
            <i [class]="uncheckedIcon" [class]="getIconClasses()"></i>
          }
        </div>
      </div>

      <!-- Label -->
      @if (label) {
        <span
          [class]="getLabelClasses()"
          [class.ml-2]="labelPosition === 'right'"
          [class.mr-2]="labelPosition === 'left'"
        >
          {{ label }}
        </span>
      }
    </label>
  `
})
export class ToggleComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() size: ToggleSize = 'md';
  @Input() type: ToggleType = 'primary';
  @Input() label = '';
  @Input() labelPosition: 'left' | 'right' = 'right';
  @Input() checkedIcon = '';
  @Input() uncheckedIcon = '';
  @Input() id = `toggle-${Math.random().toString(36).substr(2, 9)}`;

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() change = new EventEmitter<boolean>();

  private readonly sizeMap = {
    sm: {
      container: 'w-8 h-4',
      thumb: 'w-3 h-3',
      thumbOffset: 'translate-x-4',
      icon: 'text-xs',
      label: 'text-sm'
    },
    md: {
      container: 'w-11 h-6',
      thumb: 'w-5 h-5',
      thumbOffset: 'translate-x-5',
      icon: 'text-sm',
      label: 'text-base'
    },
    lg: {
      container: 'w-14 h-8',
      thumb: 'w-7 h-7',
      thumbOffset: 'translate-x-6',
      icon: 'text-base',
      label: 'text-lg'
    }
  };

  private readonly colorMap = {
    primary: {
      track: 'bg-primary-500',
      thumb: 'text-primary-500',
      icon: 'text-primary-500'
    },
    secondary: {
      track: 'bg-gray-500',
      thumb: 'text-gray-500',
      icon: 'text-gray-500'
    },
    success: {
      track: 'bg-green-500',
      thumb: 'text-green-500',
      icon: 'text-green-500'
    },
    danger: {
      track: 'bg-red-500',
      thumb: 'text-red-500',
      icon: 'text-red-500'
    },
    warning: {
      track: 'bg-yellow-500',
      thumb: 'text-yellow-500',
      icon: 'text-yellow-500'
    },
    info: {
      track: 'bg-blue-500',
      thumb: 'text-blue-500',
      icon: 'text-blue-500'
    }
  };

  getToggleContainerClasses(): string {
    return this.sizeMap[this.size].container;
  }

  getTrackClasses(): string {
    return `
      ${this.checked ? this.colorMap[this.type].track : 'bg-gray-200'}
      w-full h-full
    `;
  }

  getThumbClasses(): string {
    return `
      ${this.sizeMap[this.size].thumb}
      bg-white
      shadow-sm
      top-0.5
      left-0.5
      ${this.checked ? this.sizeMap[this.size].thumbOffset : 'translate-x-0'}
    `;
  }

  getIconClasses(): string {
    return `
      ${this.sizeMap[this.size].icon}
      ${this.colorMap[this.type].icon}
    `;
  }

  getLabelClasses(): string {
    return `
      ${this.sizeMap[this.size].label}
      text-gray-700
      select-none
    `;
  }

  onToggle(event: Event): void {
    if (!this.disabled) {
      const checked = (event.target as HTMLInputElement).checked;
      this.checked = checked;
      this.checkedChange.emit(checked);
      this.change.emit(checked);
    }
  }

  // Helper method to toggle state
  toggle(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checked);
      this.change.emit(this.checked);
    }
  }

  // Helper method to set checked state
  setChecked(checked: boolean): void {
    if (this.checked !== checked && !this.disabled) {
      this.checked = checked;
      this.checkedChange.emit(checked);
      this.change.emit(checked);
    }
  }

  // Helper method to set disabled state
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  // Helper method to set size
  setSize(size: ToggleSize): void {
    this.size = size;
  }

  // Helper method to set type
  setType(type: ToggleType): void {
    this.type = type;
  }

  // Helper method to set label
  setLabel(label: string): void {
    this.label = label;
  }

  // Helper method to set label position
  setLabelPosition(position: 'left' | 'right'): void {
    this.labelPosition = position;
  }

  // Helper method to set icons
  setIcons(checkedIcon: string, uncheckedIcon: string): void {
    this.checkedIcon = checkedIcon;
    this.uncheckedIcon = uncheckedIcon;
  }

  // Helper method to get dimensions
  getDimensions(): { width: string; height: string } {
    const [width, height] = this.sizeMap[this.size].container.split(' ');
    return {
      width: width.replace('w-', ''),
      height: height.replace('h-', '')
    };
  }

  // Helper method to get color scheme
  getColorScheme(): { track: string; thumb: string; icon: string } {
    return this.colorMap[this.type];
  }

  // Helper method to check if has label
  hasLabel(): boolean {
    return !!this.label;
  }

  // Helper method to check if has icons
  hasIcons(): boolean {
    return !!(this.checkedIcon || this.uncheckedIcon);
  }

  // Helper method to get current state
  getState(): { checked: boolean; disabled: boolean } {
    return {
      checked: this.checked,
      disabled: this.disabled
    };
  }
}