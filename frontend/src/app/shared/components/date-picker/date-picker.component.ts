import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type DatePickerView = 'days' | 'months' | 'years';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <!-- Input Field -->
      <div class="relative">
        <input
          type="text"
          [value]="formatDate(selectedDate)"
          (focus)="showCalendar = true"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          [placeholder]="placeholder"
          readonly
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 px-3 flex items-center"
          (click)="showCalendar = !showCalendar"
        >
          <i class="fas fa-calendar text-gray-400"></i>
        </button>
      </div>

      <!-- Calendar Dropdown -->
      @if (showCalendar) {
        <div
          class="absolute z-10 mt-1 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          (clickOutside)="showCalendar = false"
        >
          <!-- Calendar Header -->
          <div class="px-4 py-2 border-b flex items-center justify-between">
            @switch (currentView) {
              @case ('days') {
                <button
                  type="button"
                  class="text-sm font-medium text-gray-700 hover:text-gray-900"
                  (click)="switchView('months')"
                >
                  {{ formatMonthYear(currentDate) }}
                </button>
              }
              @case ('months') {
                <button
                  type="button"
                  class="text-sm font-medium text-gray-700 hover:text-gray-900"
                  (click)="switchView('years')"
                >
                  {{ currentDate.getFullYear() }}
                </button>
              }
              @case ('years') {
                <span class="text-sm font-medium text-gray-700">
                  {{ getYearRange() }}
                </span>
              }
            }

            <div class="flex space-x-1">
              <button
                type="button"
                class="p-1.5 hover:bg-gray-100 rounded-full"
                (click)="navigatePrevious()"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-gray-100 rounded-full"
                (click)="navigateNext()"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Calendar Body -->
          <div class="p-2">
            @switch (currentView) {
              @case ('days') {
                <!-- Weekday Headers -->
                <div class="grid grid-cols-7 mb-1">
                  @for (day of weekDays; track day) {
                    <div class="text-center text-xs font-medium text-gray-500 py-1">
                      {{ day }}
                    </div>
                  }
                </div>

                <!-- Calendar Days -->
                <div class="grid grid-cols-7 gap-1">
                  @for (week of getCalendarDays(); track $index) {
                    @for (day of week; track $index) {
                      <button
                        type="button"
                        class="w-8 h-8 text-sm rounded-full flex items-center justify-center"
                        [class]="getDayClasses(day)"
                        (click)="selectDate(day)"
                        [disabled]="isDateDisabled(day)"
                      >
                        {{ day.getDate() }}
                      </button>
                    }
                  }
                </div>
              }

              @case ('months') {
                <div class="grid grid-cols-3 gap-2">
                  @for (month of months; track month) {
                    <button
                      type="button"
                      class="py-2 text-sm rounded-md"
                      [class]="getMonthClasses(month)"
                      (click)="selectMonth(month)"
                    >
                      {{ month }}
                    </button>
                  }
                </div>
              }

              @case ('years') {
                <div class="grid grid-cols-3 gap-2">
                  @for (year of getYearsList(); track year) {
                    <button
                      type="button"
                      class="py-2 text-sm rounded-md"
                      [class]="getYearClasses(year)"
                      (click)="selectYear(year)"
                    >
                      {{ year }}
                    </button>
                  }
                </div>
              }
            }
          </div>

          <!-- Calendar Footer -->
          @if (showToday) {
            <div class="px-4 py-2 border-t">
              <button
                type="button"
                class="text-sm text-primary-600 hover:text-primary-700"
                (click)="goToToday()"
              >
                Today
              </button>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class DatePickerComponent {
  @Input() selectedDate: Date = new Date();
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() format = 'MM/dd/yyyy';
  @Input() placeholder = 'Select date';
  @Input() showToday = true;
  @Input() firstDayOfWeek = 0; // 0 = Sunday, 1 = Monday

  @Output() dateChange = new EventEmitter<Date>();

  currentDate = new Date();
  currentView: DatePickerView = 'days';
  showCalendar = false;

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit(): void {
    this.weekDays = this.getWeekDays();
    if (this.selectedDate) {
      this.currentDate = new Date(this.selectedDate);
    }
  }

  private getWeekDays(): string[] {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return [...days.slice(this.firstDayOfWeek), ...days.slice(0, this.firstDayOfWeek)];
  }

  getCalendarDays(): Date[][] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - ((startDate.getDay() - this.firstDayOfWeek + 7) % 7));
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - (endDate.getDay() - this.firstDayOfWeek + 7) % 7));
    
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(new Date(d));
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }

  getYearsList(): number[] {
    const year = this.currentDate.getFullYear();
    const startYear = Math.floor(year / 10) * 10 - 1;
    return Array.from({ length: 12 }, (_, i) => startYear + i);
  }

  getYearRange(): string {
    const years = this.getYearsList();
    return `${years[1]}-${years[10]}`;
  }

  switchView(view: DatePickerView): void {
    this.currentView = view;
  }

  navigatePrevious(): void {
    switch (this.currentView) {
      case 'days':
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        break;
      case 'months':
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        break;
      case 'years':
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 10);
        break;
    }
    this.currentDate = new Date(this.currentDate);
  }

  navigateNext(): void {
    switch (this.currentView) {
      case 'days':
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        break;
      case 'months':
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        break;
      case 'years':
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 10);
        break;
    }
    this.currentDate = new Date(this.currentDate);
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
    this.dateChange.emit(date);
    this.showCalendar = false;
  }

  selectMonth(month: string): void {
    this.currentDate.setMonth(this.months.indexOf(month));
    this.currentDate = new Date(this.currentDate);
    this.currentView = 'days';
  }

  selectYear(year: number): void {
    this.currentDate.setFullYear(year);
    this.currentDate = new Date(this.currentDate);
    this.currentView = 'months';
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.currentView = 'days';
  }

  isDateDisabled(date: Date): boolean {
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    return false;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  getDayClasses(date: Date): string {
    const baseClasses = 'hover:bg-gray-100';
    const isSelected = this.selectedDate && this.isSameDay(date, this.selectedDate);
    const isToday = this.isToday(date);
    const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();

    return `
      ${baseClasses}
      ${isSelected ? 'bg-primary-100 text-primary-700' : ''}
      ${isToday ? 'border border-primary-500' : ''}
      ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
    `.trim();
  }

  getMonthClasses(month: string): string {
    const baseClasses = 'hover:bg-gray-100';
    const isSelected = this.currentDate.getMonth() === this.months.indexOf(month);
    return `${baseClasses} ${isSelected ? 'bg-primary-100 text-primary-700' : 'text-gray-700'}`;
  }

  getYearClasses(year: number): string {
    const baseClasses = 'hover:bg-gray-100';
    const isSelected = this.currentDate.getFullYear() === year;
    return `${baseClasses} ${isSelected ? 'bg-primary-100 text-primary-700' : 'text-gray-700'}`;
  }

  formatDate(date: Date): string {
    if (!date) return '';

    let formatted = this.format;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    formatted = formatted.replace('dd', day);
    formatted = formatted.replace('MM', month);
    formatted = formatted.replace('yyyy', year);

    return formatted;
  }

  formatMonthYear(date: Date): string {
    return `${this.months[date.getMonth()]} ${date.getFullYear()}`;
  }
}