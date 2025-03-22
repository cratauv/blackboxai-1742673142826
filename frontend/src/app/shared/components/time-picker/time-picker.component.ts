import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TimeUnit {
  value: number;
  label: string;
}

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <!-- Input Field -->
      <div class="relative">
        <input
          type="text"
          [value]="formatTime()"
          (focus)="showPicker = true"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          [placeholder]="placeholder"
          readonly
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 px-3 flex items-center"
          (click)="showPicker = !showPicker"
        >
          <i class="fas fa-clock text-gray-400"></i>
        </button>
      </div>

      <!-- Time Picker Dropdown -->
      @if (showPicker) {
        <div
          class="absolute z-10 mt-1 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          (clickOutside)="showPicker = false"
        >
          <!-- Time Display -->
          <div class="p-4 border-b">
            <div class="text-3xl font-semibold text-center text-gray-900">
              {{ formatTime() }}
            </div>
            @if (showPeriod) {
              <div class="mt-2 flex justify-center space-x-2">
                <button
                  type="button"
                  class="px-3 py-1 text-sm rounded-md"
                  [class]="getPeriodButtonClasses('AM')"
                  (click)="setPeriod('AM')"
                >
                  AM
                </button>
                <button
                  type="button"
                  class="px-3 py-1 text-sm rounded-md"
                  [class]="getPeriodButtonClasses('PM')"
                  (click)="setPeriod('PM')"
                >
                  PM
                </button>
              </div>
            }
          </div>

          <!-- Time Selector -->
          <div class="p-4 grid grid-cols-3 gap-4">
            <!-- Hours -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Hours
              </label>
              <div class="space-y-1 h-48 overflow-auto">
                @for (hour of getHours(); track hour.value) {
                  <button
                    type="button"
                    class="w-full py-2 text-sm rounded-md"
                    [class]="getTimeUnitClasses(hour.value, selectedHour)"
                    (click)="setHour(hour.value)"
                  >
                    {{ hour.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Minutes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Minutes
              </label>
              <div class="space-y-1 h-48 overflow-auto">
                @for (minute of getMinutes(); track minute.value) {
                  <button
                    type="button"
                    class="w-full py-2 text-sm rounded-md"
                    [class]="getTimeUnitClasses(minute.value, selectedMinute)"
                    (click)="setMinute(minute.value)"
                  >
                    {{ minute.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Seconds -->
            @if (showSeconds) {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Seconds
                </label>
                <div class="space-y-1 h-48 overflow-auto">
                  @for (second of getSeconds(); track second.value) {
                    <button
                      type="button"
                      class="w-full py-2 text-sm rounded-md"
                      [class]="getTimeUnitClasses(second.value, selectedSecond)"
                      (click)="setSecond(second.value)"
                    >
                      {{ second.label }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Actions -->
          <div class="p-4 border-t flex justify-between">
            <button
              type="button"
              class="text-sm text-primary-600 hover:text-primary-700"
              (click)="setCurrentTime()"
            >
              Now
            </button>
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              (click)="confirmSelection()"
            >
              OK
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class TimePickerComponent {
  @Input() value?: Date;
  @Input() format = 'hh:mm A';
  @Input() placeholder = 'Select time';
  @Input() minuteStep = 1;
  @Input() secondStep = 1;
  @Input() showSeconds = false;
  @Input() showPeriod = true;
  @Input() minTime?: Date;
  @Input() maxTime?: Date;

  @Output() valueChange = new EventEmitter<Date>();

  showPicker = false;
  selectedHour = 12;
  selectedMinute = 0;
  selectedSecond = 0;
  selectedPeriod: 'AM' | 'PM' = 'AM';

  ngOnInit(): void {
    this.initializeTime();
  }

  ngOnChanges(): void {
    this.initializeTime();
  }

  private initializeTime(): void {
    if (this.value) {
      const hours = this.value.getHours();
      this.selectedHour = this.showPeriod ? (hours % 12 || 12) : hours;
      this.selectedMinute = this.value.getMinutes();
      this.selectedSecond = this.value.getSeconds();
      this.selectedPeriod = hours >= 12 ? 'PM' : 'AM';
    } else {
      this.setCurrentTime();
    }
  }

  getHours(): TimeUnit[] {
    const count = this.showPeriod ? 12 : 24;
    const start = this.showPeriod ? 1 : 0;
    return Array.from({ length: count }, (_, i) => ({
      value: start + i,
      label: (start + i).toString().padStart(2, '0')
    }));
  }

  getMinutes(): TimeUnit[] {
    return Array.from({ length: 60 / this.minuteStep }, (_, i) => {
      const value = i * this.minuteStep;
      return {
        value,
        label: value.toString().padStart(2, '0')
      };
    });
  }

  getSeconds(): TimeUnit[] {
    return Array.from({ length: 60 / this.secondStep }, (_, i) => {
      const value = i * this.secondStep;
      return {
        value,
        label: value.toString().padStart(2, '0')
      };
    });
  }

  setHour(hour: number): void {
    this.selectedHour = hour;
  }

  setMinute(minute: number): void {
    this.selectedMinute = minute;
  }

  setSecond(second: number): void {
    this.selectedSecond = second;
  }

  setPeriod(period: 'AM' | 'PM'): void {
    this.selectedPeriod = period;
  }

  setCurrentTime(): void {
    const now = new Date();
    const hours = now.getHours();
    this.selectedHour = this.showPeriod ? (hours % 12 || 12) : hours;
    this.selectedMinute = now.getMinutes();
    this.selectedSecond = now.getSeconds();
    this.selectedPeriod = hours >= 12 ? 'PM' : 'AM';
  }

  confirmSelection(): void {
    const date = new Date();
    let hours = this.selectedHour;
    
    if (this.showPeriod) {
      if (this.selectedPeriod === 'PM' && hours !== 12) hours += 12;
      if (this.selectedPeriod === 'AM' && hours === 12) hours = 0;
    }

    date.setHours(hours);
    date.setMinutes(this.selectedMinute);
    date.setSeconds(this.selectedSecond);
    date.setMilliseconds(0);

    if (this.isTimeValid(date)) {
      this.value = date;
      this.valueChange.emit(date);
      this.showPicker = false;
    }
  }

  formatTime(): string {
    if (!this.value) return '';

    let hours = this.value.getHours();
    const minutes = this.value.getMinutes();
    const seconds = this.value.getSeconds();
    let period = '';

    if (this.showPeriod) {
      period = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12 || 12;
    }

    let formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    if (this.showSeconds) {
      formatted += `:${seconds.toString().padStart(2, '0')}`;
    }

    return formatted + period;
  }

  getTimeUnitClasses(value: number, selectedValue: number): string {
    return value === selectedValue
      ? 'bg-primary-100 text-primary-700'
      : 'text-gray-700 hover:bg-gray-100';
  }

  getPeriodButtonClasses(period: string): string {
    return period === this.selectedPeriod
      ? 'bg-primary-100 text-primary-700'
      : 'text-gray-700 hover:bg-gray-100';
  }

  private isTimeValid(date: Date): boolean {
    if (this.minTime && date < this.minTime) return false;
    if (this.maxTime && date > this.maxTime) return false;
    return true;
  }

  // Helper method to get current time
  getCurrentTime(): Date {
    return new Date();
  }

  // Helper method to check if time is within range
  isWithinRange(date: Date): boolean {
    return this.isTimeValid(date);
  }

  // Helper method to get formatted time string
  getTimeString(format?: string): string {
    if (!this.value) return '';
    
    // TODO: Implement custom format string parsing
    return this.formatTime();
  }

  // Helper method to parse time string
  parseTimeString(timeString: string): Date | null {
    // TODO: Implement time string parsing
    return null;
  }

  // Helper method to increment hour
  incrementHour(): void {
    const maxHours = this.showPeriod ? 12 : 23;
    this.selectedHour = (this.selectedHour % maxHours) + 1;
  }

  // Helper method to decrement hour
  decrementHour(): void {
    const maxHours = this.showPeriod ? 12 : 23;
    this.selectedHour = this.selectedHour === 1 ? maxHours : this.selectedHour - 1;
  }

  // Helper method to increment minute
  incrementMinute(): void {
    this.selectedMinute = (this.selectedMinute + this.minuteStep) % 60;
  }

  // Helper method to decrement minute
  decrementMinute(): void {
    this.selectedMinute = this.selectedMinute === 0 ? 60 - this.minuteStep : this.selectedMinute - this.minuteStep;
  }

  // Helper method to increment second
  incrementSecond(): void {
    this.selectedSecond = (this.selectedSecond + this.secondStep) % 60;
  }

  // Helper method to decrement second
  decrementSecond(): void {
    this.selectedSecond = this.selectedSecond === 0 ? 60 - this.secondStep : this.selectedSecond - this.secondStep;
  }

  // Helper method to toggle period
  togglePeriod(): void {
    this.selectedPeriod = this.selectedPeriod === 'AM' ? 'PM' : 'AM';
  }
}