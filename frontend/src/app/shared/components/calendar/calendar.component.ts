import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  color?: string;
  textColor?: string;
  data?: any;
}

type ViewType = 'month' | 'week' | 'day';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow">
      <!-- Calendar Header -->
      <div class="px-4 py-3 border-b flex items-center justify-between">
        <!-- Navigation -->
        <div class="flex items-center space-x-4">
          <button
            type="button"
            class="p-1.5 hover:bg-gray-100 rounded-full"
            (click)="previousPeriod()"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            type="button"
            class="p-1.5 hover:bg-gray-100 rounded-full"
            (click)="nextPeriod()"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ getCurrentPeriodLabel() }}
          </h2>
          <button
            type="button"
            class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            (click)="today()"
          >
            Today
          </button>
        </div>

        <!-- View Switcher -->
        <div class="flex rounded-md shadow-sm">
          @for (type of viewTypes; track type) {
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0"
              [class]="getViewButtonClasses(type)"
              (click)="switchView(type)"
            >
              {{ type | titlecase }}
            </button>
          }
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="p-4">
        <!-- Week Days Header -->
        <div class="grid grid-cols-7 gap-px mb-2">
          @for (day of weekDays; track day) {
            <div class="text-sm font-medium text-gray-500 text-center py-2">
              {{ day }}
            </div>
          }
        </div>

        <!-- Month View -->
        @if (currentView === 'month') {
          <div class="grid grid-cols-7 gap-px bg-gray-200">
            @for (week of getMonthDays(); track $index) {
              @for (day of week; track $index) {
                <div
                  class="min-h-[120px] bg-white"
                  [class]="getDayClasses(day)"
                  (click)="onDayClick(day)"
                >
                  <!-- Day Number -->
                  <div class="px-2 py-1">
                    <span
                      class="text-sm"
                      [class.text-gray-500]="!isCurrentMonth(day)"
                    >
                      {{ day.getDate() }}
                    </span>
                  </div>

                  <!-- Events -->
                  <div class="px-1 space-y-1">
                    @for (event of getEventsForDay(day); track event.id) {
                      <div
                        class="text-xs px-2 py-1 rounded truncate"
                        [style.backgroundColor]="event.color || '#E5E7EB'"
                        [style.color]="event.textColor || '#111827'"
                        (click)="onEventClick($event, event)"
                      >
                        {{ event.title }}
                      </div>
                    }
                  </div>
                </div>
              }
            }
          </div>
        }

        <!-- Week View -->
        @if (currentView === 'week') {
          <div class="space-y-2">
            @for (hour of getHours(); track hour) {
              <div class="grid grid-cols-8 gap-px bg-gray-200">
                <!-- Time Column -->
                <div class="bg-white px-2 py-1">
                  <span class="text-sm text-gray-500">
                    {{ formatHour(hour) }}
                  </span>
                </div>

                <!-- Days -->
                @for (day of getWeekDays(); track $index) {
                  <div
                    class="bg-white min-h-[60px]"
                    [class]="getDayClasses(day)"
                    (click)="onTimeSlotClick(day, hour)"
                  >
                    <!-- Events -->
                    @for (event of getEventsForHour(day, hour); track event.id) {
                      <div
                        class="text-xs px-2 py-1 m-1 rounded"
                        [style.backgroundColor]="event.color || '#E5E7EB'"
                        [style.color]="event.textColor || '#111827'"
                        (click)="onEventClick($event, event)"
                      >
                        {{ event.title }}
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- Day View -->
        @if (currentView === 'day') {
          <div class="space-y-2">
            @for (hour of getHours(); track hour) {
              <div class="grid grid-cols-2 gap-px bg-gray-200">
                <!-- Time Column -->
                <div class="bg-white px-2 py-1 w-20">
                  <span class="text-sm text-gray-500">
                    {{ formatHour(hour) }}
                  </span>
                </div>

                <!-- Events -->
                <div
                  class="bg-white min-h-[60px]"
                  (click)="onTimeSlotClick(currentDate, hour)"
                >
                  @for (event of getEventsForHour(currentDate, hour); track event.id) {
                    <div
                      class="text-sm px-2 py-1 m-1 rounded"
                      [style.backgroundColor]="event.color || '#E5E7EB'"
                      [style.color]="event.textColor || '#111827'"
                      (click)="onEventClick($event, event)"
                    >
                      {{ event.title }}
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class CalendarComponent {
  @Input() events: CalendarEvent[] = [];
  @Input() currentView: ViewType = 'month';
  @Input() currentDate = new Date();

  @Output() dateChange = new EventEmitter<Date>();
  @Output() viewChange = new EventEmitter<ViewType>();
  @Output() dayClick = new EventEmitter<Date>();
  @Output() eventClick = new EventEmitter<CalendarEvent>();
  @Output() timeSlotClick = new EventEmitter<{ date: Date; hour: number }>();

  viewTypes: ViewType[] = ['month', 'week', 'day'];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  previousPeriod(): void {
    const date = new Date(this.currentDate);
    switch (this.currentView) {
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'day':
        date.setDate(date.getDate() - 1);
        break;
    }
    this.currentDate = date;
    this.dateChange.emit(date);
  }

  nextPeriod(): void {
    const date = new Date(this.currentDate);
    switch (this.currentView) {
      case 'month':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'week':
        date.setDate(date.getDate() + 7);
        break;
      case 'day':
        date.setDate(date.getDate() + 1);
        break;
    }
    this.currentDate = date;
    this.dateChange.emit(date);
  }

  today(): void {
    this.currentDate = new Date();
    this.dateChange.emit(this.currentDate);
  }

  switchView(view: ViewType): void {
    this.currentView = view;
    this.viewChange.emit(view);
  }

  getCurrentPeriodLabel(): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };

    if (this.currentView === 'week') {
      const start = this.getStartOfWeek(this.currentDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    if (this.currentView === 'day') {
      options.day = 'numeric';
    }

    return this.currentDate.toLocaleDateString('en-US', options);
  }

  getViewButtonClasses(type: ViewType): string {
    return `
      ${type === this.currentView
        ? 'bg-primary-50 text-primary-600 border-primary-500 z-10'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }
    `;
  }

  getDayClasses(date: Date): string {
    const isToday = this.isToday(date);
    const isCurrentMonth = this.isCurrentMonth(date);

    return `
      ${isToday ? 'bg-primary-50' : 'hover:bg-gray-50'}
      ${!isCurrentMonth && this.currentView === 'month' ? 'bg-gray-50' : ''}
      cursor-pointer
    `;
  }

  getMonthDays(): Date[][] {
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    
    const startDate = this.getStartOfWeek(firstDay);
    const endDate = this.getEndOfWeek(lastDay);
    
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
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

  getWeekDays(): Date[] {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    const days: Date[] = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  }

  getHours(): number[] {
    return Array.from({ length: 24 }, (_, i) => i);
  }

  formatHour(hour: number): string {
    return new Date(0, 0, 0, hour).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    });
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  }

  getEventsForHour(date: Date, hour: number): CalendarEvent[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getHours() === hour;
    });
  }

  onDayClick(date: Date): void {
    this.dayClick.emit(date);
  }

  onEventClick(event: MouseEvent, calendarEvent: CalendarEvent): void {
    event.stopPropagation();
    this.eventClick.emit(calendarEvent);
  }

  onTimeSlotClick(date: Date, hour: number): void {
    this.timeSlotClick.emit({ date, hour });
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  }

  private getEndOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (6 - day));
    return d;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  private isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  // Helper method to add event
  addEvent(event: CalendarEvent): void {
    this.events = [...this.events, event];
  }

  // Helper method to remove event
  removeEvent(eventId: string | number): void {
    this.events = this.events.filter(event => event.id !== eventId);
  }

  // Helper method to update event
  updateEvent(eventId: string | number, updates: Partial<CalendarEvent>): void {
    this.events = this.events.map(event =>
      event.id === eventId ? { ...event, ...updates } : event
    );
  }

  // Helper method to get events for date range
  getEventsInRange(start: Date, end: Date): CalendarEvent[] {
    return this.events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = event.end ? new Date(event.end) : eventStart;
      return eventStart >= start && eventEnd <= end;
    });
  }

  // Helper method to check if date has events
  hasEvents(date: Date): boolean {
    return this.getEventsForDay(date).length > 0;
  }

  // Helper method to get event count for date
  getEventCount(date: Date): number {
    return this.getEventsForDay(date).length;
  }
}