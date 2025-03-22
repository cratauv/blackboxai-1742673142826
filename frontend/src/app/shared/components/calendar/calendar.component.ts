import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  color?: string;
  allDay?: boolean;
  description?: string;
}

type CalendarView = 'month' | 'week' | 'day';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full">
      <!-- Calendar Header -->
      <div class="flex items-center justify-between px-4 py-2 border-b">
        <!-- Navigation -->
        <div class="flex items-center space-x-4">
          <button
            type="button"
            class="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            (click)="previousPeriod()"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            type="button"
            class="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            (click)="nextPeriod()"
          >
            <i class="fas fa-chevron-right"></i>
          </button>

          <button
            type="button"
            class="px-3 py-1 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            (click)="today()"
          >
            Today
          </button>

          <h2 class="text-lg font-semibold text-gray-900">
            {{ getCurrentPeriodLabel() }}
          </h2>
        </div>

        <!-- View Switcher -->
        <div class="flex rounded-md shadow-sm">
          @for (v of ['month', 'week', 'day']; track v) {
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium border first:rounded-l-md last:rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10"
              [class]="getViewButtonClasses(v)"
              (click)="switchView(v as CalendarView)"
            >
              {{ v | titlecase }}
            </button>
          }
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="flex-1 overflow-auto">
        @switch (view) {
          @case ('month') {
            <!-- Month View -->
            <div class="grid grid-cols-7 h-full">
              <!-- Week Days Header -->
              @for (day of weekDays; track day) {
                <div class="px-2 py-3 text-sm font-medium text-gray-900 text-center border-b">
                  {{ day }}
                </div>
              }

              <!-- Calendar Days -->
              @for (week of getMonthDays(); track $index) {
                @for (day of week; track $index) {
                  <div
                    class="min-h-[120px] p-2 border-b border-r relative"
                    [class]="getDayClasses(day)"
                  >
                    <!-- Day Number -->
                    <span
                      class="inline-flex h-6 w-6 items-center justify-center rounded-full text-sm"
                      [class]="getDayNumberClasses(day)"
                    >
                      {{ day.getDate() }}
                    </span>

                    <!-- Events -->
                    <div class="mt-2 space-y-1">
                      @for (event of getEventsForDay(day); track event.id) {
                        <div
                          class="text-xs truncate rounded px-2 py-1 cursor-pointer"
                          [style.backgroundColor]="event.color + '20'"
                          [style.color]="event.color"
                          (click)="onEventClick(event)"
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

          @case ('week') {
            <!-- Week View -->
            <div class="grid grid-cols-7 h-full">
              <!-- Week Days Header -->
              @for (day of getWeekDays(); track $index) {
                <div class="px-2 py-3 text-sm font-medium text-center border-b">
                  <div>{{ weekDays[$index] }}</div>
                  <div
                    class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full"
                    [class]="getDayNumberClasses(day)"
                  >
                    {{ day.getDate() }}
                  </div>
                </div>
              }

              <!-- Time Slots -->
              @for (hour of hours; track hour) {
                @for (day of getWeekDays(); track $index) {
                  <div
                    class="h-12 border-b border-r relative"
                    [class]="getTimeSlotClasses(day, hour)"
                  >
                    @if ($index === 0) {
                      <div class="absolute -left-16 top-0 w-12 text-right pr-2 text-sm text-gray-500">
                        {{ formatHour(hour) }}
                      </div>
                    }

                    <!-- Events -->
                    @for (event of getEventsForTimeSlot(day, hour); track event.id) {
                      <div
                        class="absolute left-0 right-0 mx-1 rounded px-2 py-1 text-xs truncate cursor-pointer"
                        [style.backgroundColor]="event.color + '20'"
                        [style.color]="event.color"
                        [style.top.px]="getEventTop(event)"
                        [style.height.px]="getEventHeight(event)"
                        (click)="onEventClick(event)"
                      >
                        {{ event.title }}
                      </div>
                    }
                  </div>
                }
              }
            </div>
          }

          @case ('day') {
            <!-- Day View -->
            <div class="flex flex-col h-full">
              <!-- Day Header -->
              <div class="px-2 py-3 text-center border-b">
                <div class="text-sm font-medium">
                  {{ weekDays[currentDate.getDay()] }}
                </div>
                <div
                  class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full"
                  [class]="getDayNumberClasses(currentDate)"
                >
                  {{ currentDate.getDate() }}
                </div>
              </div>

              <!-- Time Slots -->
              @for (hour of hours; track hour) {
                <div
                  class="h-12 border-b relative"
                  [class]="getTimeSlotClasses(currentDate, hour)"
                >
                  <div class="absolute -left-16 top-0 w-12 text-right pr-2 text-sm text-gray-500">
                    {{ formatHour(hour) }}
                  </div>

                  <!-- Events -->
                  @for (event of getEventsForTimeSlot(currentDate, hour); track event.id) {
                    <div
                      class="absolute left-0 right-0 mx-1 rounded px-2 py-1 text-xs truncate cursor-pointer"
                      [style.backgroundColor]="event.color + '20'"
                      [style.color]="event.color"
                      [style.top.px]="getEventTop(event)"
                      [style.height.px]="getEventHeight(event)"
                      (click)="onEventClick(event)"
                    >
                      {{ event.title }}
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
  @Input() events: CalendarEvent[] = [];
  @Input() view: CalendarView = 'month';
  @Input() currentDate = new Date();

  @Output() eventClick = new EventEmitter<CalendarEvent>();
  @Output() dateClick = new EventEmitter<Date>();
  @Output() viewChange = new EventEmitter<CalendarView>();

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = Array.from({ length: 24 }, (_, i) => i);

  getViewButtonClasses(viewType: string): string {
    const baseClasses = 'border-gray-300';
    return viewType === this.view
      ? `${baseClasses} bg-primary-50 text-primary-600 border-primary-600 z-10`
      : `${baseClasses} bg-white text-gray-700 hover:bg-gray-50`;
  }

  getDayClasses(date: Date): string {
    const baseClasses = 'hover:bg-gray-50';
    const isToday = this.isToday(date);
    const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
    
    return `
      ${baseClasses}
      ${isToday ? 'bg-primary-50' : ''}
      ${!isCurrentMonth ? 'text-gray-400' : ''}
    `.trim();
  }

  getDayNumberClasses(date: Date): string {
    return this.isToday(date)
      ? 'bg-primary-600 text-white'
      : 'text-gray-900';
  }

  getTimeSlotClasses(date: Date, hour: number): string {
    const baseClasses = 'hover:bg-gray-50';
    const isCurrentHour = this.isCurrentHour(date, hour);
    
    return `
      ${baseClasses}
      ${isCurrentHour ? 'bg-primary-50' : ''}
    `.trim();
  }

  previousPeriod(): void {
    const date = new Date(this.currentDate);
    switch (this.view) {
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
  }

  nextPeriod(): void {
    const date = new Date(this.currentDate);
    switch (this.view) {
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
  }

  today(): void {
    this.currentDate = new Date();
  }

  switchView(view: CalendarView): void {
    this.view = view;
    this.viewChange.emit(view);
  }

  onEventClick(event: CalendarEvent): void {
    this.eventClick.emit(event);
  }

  getCurrentPeriodLabel(): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };

    if (this.view === 'week') {
      const start = this.getStartOfWeek(this.currentDate);
      const end = this.getEndOfWeek(this.currentDate);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    if (this.view === 'day') {
      return this.currentDate.toLocaleDateString('en-US', { ...options, day: 'numeric' });
    }

    return this.currentDate.toLocaleDateString('en-US', options);
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
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
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

  getEventsForTimeSlot(date: Date, hour: number): CalendarEvent[] {
    return this.events.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart.getDate() === date.getDate() &&
             eventStart.getMonth() === date.getMonth() &&
             eventStart.getFullYear() === date.getFullYear() &&
             eventStart.getHours() === hour;
    });
  }

  getEventTop(event: CalendarEvent): number {
    return (event.start.getMinutes() / 60) * 48;
  }

  getEventHeight(event: CalendarEvent): number {
    if (!event.end) return 24;
    const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
    return (duration / 60) * 48;
  }

  formatHour(hour: number): string {
    return new Date(0, 0, 0, hour).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    });
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  private isCurrentHour(date: Date, hour: number): boolean {
    const now = new Date();
    return this.isToday(date) && now.getHours() === hour;
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
}