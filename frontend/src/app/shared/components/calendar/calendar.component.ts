import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  events?: CalendarEvent[];
}

interface CalendarEvent {
  id: string | number;
  title: string;
  color?: string;
  time?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <!-- Calendar Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
        </h2>
        <div class="flex space-x-2">
          <button
            type="button"
            class="p-1.5 hover:bg-gray-100 rounded-full"
            (click)="previousMonth()"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            type="button"
            class="p-1.5 hover:bg-gray-100 rounded-full"
            (click)="today()"
          >
            Today
          </button>
          <button
            type="button"
            class="p-1.5 hover:bg-gray-100 rounded-full"
            (click)="nextMonth()"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        <!-- Weekday Headers -->
        @for (day of weekDays; track day) {
          <div class="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
            {{ day }}
          </div>
        }

        <!-- Calendar Days -->
        @for (week of weeks; track $index) {
          @for (day of week; track day.date) {
            <div
              [class]="getDayClasses(day)"
              (click)="onDayClick(day)"
            >
              <!-- Day Number -->
              <div class="flex items-center justify-center h-8 w-8 mx-auto">
                {{ day.date.getDate() }}
              </div>

              <!-- Events -->
              @if (day.events?.length && showEvents) {
                <div class="px-1 pb-1">
                  @for (event of day.events.slice(0, maxEventsPerDay); track event.id) {
                    <div
                      class="text-xs truncate rounded px-1 mb-0.5"
                      [style.backgroundColor]="event.color || '#E5E7EB'"
                    >
                      @if (event.time) {
                        <span class="font-medium">{{ event.time }}</span>
                      }
                      {{ event.title }}
                    </div>
                  }
                  @if (day.events.length > maxEventsPerDay) {
                    <div class="text-xs text-gray-500 text-center">
                      +{{ day.events.length - maxEventsPerDay }} more
                    </div>
                  }
                </div>
              }
            </div>
          }
        }
      </div>
    </div>
  `
})
export class CalendarComponent {
  @Input() selectedDate: Date = new Date();
  @Input() events: { date: Date; events: CalendarEvent[] }[] = [];
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() disabledDates: Date[] = [];
  @Input() showEvents = true;
  @Input() maxEventsPerDay = 3;

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<Date>();

  currentDate = new Date();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weeks: CalendarDay[][] = [];

  constructor() {
    this.buildCalendar();
  }

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get days from previous month to fill first week
    const daysFromPrevMonth = firstDay.getDay();
    const prevMonth = new Date(year, month, 0);
    
    this.weeks = [];
    let currentWeek: CalendarDay[] = [];
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      currentWeek.push(this.createCalendarDay(date, false));
    }
    
    // Add days from current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      currentWeek.push(this.createCalendarDay(date, true));
      
      if (currentWeek.length === 7) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Add days from next month
    if (currentWeek.length > 0) {
      const daysFromNextMonth = 7 - currentWeek.length;
      for (let day = 1; day <= daysFromNextMonth; day++) {
        const date = new Date(year, month + 1, day);
        currentWeek.push(this.createCalendarDay(date, false));
      }
      this.weeks.push(currentWeek);
    }
  }

  createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const today = new Date();
    const events = this.events.find(e => 
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    )?.events || [];

    return {
      date,
      isToday: this.isSameDay(date, today),
      isSelected: this.isSameDay(date, this.selectedDate),
      isCurrentMonth,
      isDisabled: this.isDateDisabled(date),
      events
    };
  }

  getDayClasses(day: CalendarDay): string {
    return `
      relative bg-white p-1 hover:bg-gray-50 cursor-pointer
      ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
      ${day.isToday ? 'font-bold' : ''}
      ${day.isSelected ? 'bg-primary-50' : ''}
      ${day.isDisabled ? 'cursor-not-allowed opacity-50' : ''}
    `;
  }

  onDayClick(day: CalendarDay): void {
    if (!day.isDisabled) {
      this.selectedDate = day.date;
      this.dateSelected.emit(day.date);
    }
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.buildCalendar();
    this.monthChanged.emit(this.currentDate);
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.buildCalendar();
    this.monthChanged.emit(this.currentDate);
  }

  today(): void {
    this.currentDate = new Date();
    this.buildCalendar();
    this.monthChanged.emit(this.currentDate);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private isDateDisabled(date: Date): boolean {
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    return this.disabledDates.some(d => this.isSameDay(date, d));
  }

  // Helper method to set selected date
  setSelectedDate(date: Date): void {
    this.selectedDate = date;
    this.dateSelected.emit(date);
  }

  // Helper method to navigate to specific month
  navigateToMonth(date: Date): void {
    this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.buildCalendar();
    this.monthChanged.emit(this.currentDate);
  }

  // Helper method to add event
  addEvent(date: Date, event: CalendarEvent): void {
    const existingEvents = this.events.find(e => this.isSameDay(e.date, date));
    if (existingEvents) {
      existingEvents.events.push(event);
    } else {
      this.events.push({ date, events: [event] });
    }
    this.buildCalendar();
  }

  // Helper method to remove event
  removeEvent(date: Date, eventId: string | number): void {
    const existingEvents = this.events.find(e => this.isSameDay(e.date, date));
    if (existingEvents) {
      existingEvents.events = existingEvents.events.filter(e => e.id !== eventId);
      if (existingEvents.events.length === 0) {
        this.events = this.events.filter(e => !this.isSameDay(e.date, date));
      }
      this.buildCalendar();
    }
  }

  // Helper method to clear events
  clearEvents(): void {
    this.events = [];
    this.buildCalendar();
  }

  // Helper method to get events for date
  getEvents(date: Date): CalendarEvent[] {
    return this.events.find(e => this.isSameDay(e.date, date))?.events || [];
  }

  // Helper method to check if date has events
  hasEvents(date: Date): boolean {
    return this.getEvents(date).length > 0;
  }

  // Helper method to get event count for date
  getEventCount(date: Date): number {
    return this.getEvents(date).length;
  }
}