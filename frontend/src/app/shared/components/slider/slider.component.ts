import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Mark {
  value: number;
  label?: string;
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative" [style.padding]="showTooltip ? '1rem 0' : 0">
      <!-- Track -->
      <div
        class="relative h-1.5 bg-gray-200 rounded-full"
        [class.cursor-pointer]="!disabled"
        #track
        (click)="onTrackClick($event)"
      >
        <!-- Progress Bar -->
        @if (range) {
          <div
            class="absolute h-full rounded-full bg-primary-500"
            [style.left]="getLeftProgress()"
            [style.width]="getRangeWidth()"
            [class.opacity-50]="disabled"
          ></div>
        } @else {
          <div
            class="absolute h-full rounded-full bg-primary-500"
            [style.width]="getSingleProgress()"
            [class.opacity-50]="disabled"
          ></div>
        }

        <!-- Marks -->
        @if (showMarks) {
          @for (mark of marks; track mark.value) {
            <div
              class="absolute top-4 -translate-x-1/2"
              [style.left]="getMarkPosition(mark.value)"
            >
              <div class="w-0.5 h-1.5 bg-gray-300"></div>
              @if (mark.label) {
                <div class="mt-1 text-xs text-gray-500">{{ mark.label }}</div>
              }
            </div>
          }
        }

        <!-- Handles -->
        @if (range) {
          <!-- Start Handle -->
          <div
            #startHandle
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary-500 cursor-grab active:cursor-grabbing"
            [class.ring-2]="isDraggingStart"
            [class.opacity-50]="disabled"
            [style.left]="getLeftProgress()"
            (mousedown)="onHandleMouseDown($event, 'start')"
            (touchstart)="onHandleTouchStart($event, 'start')"
          >
            @if (showTooltip) {
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap"
                [class.opacity-0]="!isDraggingStart"
              >
                {{ formatValue(startValue) }}
              </div>
            }
          </div>

          <!-- End Handle -->
          <div
            #endHandle
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary-500 cursor-grab active:cursor-grabbing"
            [class.ring-2]="isDraggingEnd"
            [class.opacity-50]="disabled"
            [style.left]="getRightProgress()"
            (mousedown)="onHandleMouseDown($event, 'end')"
            (touchstart)="onHandleTouchStart($event, 'end')"
          >
            @if (showTooltip) {
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap"
                [class.opacity-0]="!isDraggingEnd"
              >
                {{ formatValue(endValue) }}
              </div>
            }
          </div>
        } @else {
          <!-- Single Handle -->
          <div
            #handle
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary-500 cursor-grab active:cursor-grabbing"
            [class.ring-2]="isDragging"
            [class.opacity-50]="disabled"
            [style.left]="getSingleProgress()"
            (mousedown)="onHandleMouseDown($event, 'single')"
            (touchstart)="onHandleTouchStart($event, 'single')"
          >
            @if (showTooltip) {
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap"
                [class.opacity-0]="!isDragging"
              >
                {{ formatValue(value) }}
              </div>
            }
          </div>
        }
      </div>

      <!-- Input Values -->
      @if (showInput) {
        <div class="mt-4 flex items-center space-x-4">
          @if (range) {
            <input
              type="number"
              [min]="min"
              [max]="endValue"
              [step]="step"
              [(ngModel)]="startValue"
              (ngModelChange)="onStartValueChange($event)"
              [disabled]="disabled"
              class="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span class="text-gray-500">to</span>
            <input
              type="number"
              [min]="startValue"
              [max]="max"
              [step]="step"
              [(ngModel)]="endValue"
              (ngModelChange)="onEndValueChange($event)"
              [disabled]="disabled"
              class="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          } @else {
            <input
              type="number"
              [min]="min"
              [max]="max"
              [step]="step"
              [(ngModel)]="value"
              (ngModelChange)="onValueChange($event)"
              [disabled]="disabled"
              class="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          }
        </div>
      }
    </div>
  `
})
export class SliderComponent {
  @ViewChild('track') track!: ElementRef<HTMLDivElement>;
  @ViewChild('handle') handle?: ElementRef<HTMLDivElement>;
  @ViewChild('startHandle') startHandle?: ElementRef<HTMLDivElement>;
  @ViewChild('endHandle') endHandle?: ElementRef<HTMLDivElement>;

  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() value = 0;
  @Input() startValue = 0;
  @Input() endValue = 100;
  @Input() range = false;
  @Input() disabled = false;
  @Input() showTooltip = true;
  @Input() showInput = true;
  @Input() showMarks = false;
  @Input() marks: Mark[] = [];
  @Input() formatter?: (value: number) => string;

  @Output() valueChange = new EventEmitter<number>();
  @Output() startValueChange = new EventEmitter<number>();
  @Output() endValueChange = new EventEmitter<number>();
  @Output() change = new EventEmitter<number | [number, number]>();

  isDragging = false;
  isDraggingStart = false;
  isDraggingEnd = false;
  activeHandle: 'single' | 'start' | 'end' = 'single';

  ngOnInit(): void {
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  private setupEventListeners(): void {
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('touchmove', this.onTouchMove.bind(this));
    document.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    document.removeEventListener('touchmove', this.onTouchMove.bind(this));
    document.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }

  onTrackClick(event: MouseEvent): void {
    if (this.disabled) return;

    const rect = this.track.nativeElement.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    const newValue = this.min + (this.max - this.min) * percentage;
    const snappedValue = this.snapToStep(newValue);

    if (this.range) {
      // Find closest handle
      const distanceToStart = Math.abs(this.startValue - snappedValue);
      const distanceToEnd = Math.abs(this.endValue - snappedValue);
      
      if (distanceToStart < distanceToEnd) {
        this.updateStartValue(snappedValue);
      } else {
        this.updateEndValue(snappedValue);
      }
    } else {
      this.updateValue(snappedValue);
    }
  }

  onHandleMouseDown(event: MouseEvent, handle: 'single' | 'start' | 'end'): void {
    if (this.disabled) return;
    event.preventDefault();
    this.startDragging(handle);
  }

  onHandleTouchStart(event: TouchEvent, handle: 'single' | 'start' | 'end'): void {
    if (this.disabled) return;
    event.preventDefault();
    this.startDragging(handle);
  }

  private startDragging(handle: 'single' | 'start' | 'end'): void {
    this.activeHandle = handle;
    switch (handle) {
      case 'single':
        this.isDragging = true;
        break;
      case 'start':
        this.isDraggingStart = true;
        break;
      case 'end':
        this.isDraggingEnd = true;
        break;
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.isDragging || this.isDraggingStart || this.isDraggingEnd) {
      this.handleMove(event.clientX);
    }
  }

  private onTouchMove(event: TouchEvent): void {
    if (this.isDragging || this.isDraggingStart || this.isDraggingEnd) {
      this.handleMove(event.touches[0].clientX);
    }
  }

  private handleMove(clientX: number): void {
    const rect = this.track.nativeElement.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const newValue = this.min + (this.max - this.min) * percentage;
    const snappedValue = this.snapToStep(newValue);

    switch (this.activeHandle) {
      case 'single':
        this.updateValue(snappedValue);
        break;
      case 'start':
        this.updateStartValue(Math.min(snappedValue, this.endValue));
        break;
      case 'end':
        this.updateEndValue(Math.max(snappedValue, this.startValue));
        break;
    }
  }

  private onMouseUp(): void {
    this.stopDragging();
  }

  private onTouchEnd(): void {
    this.stopDragging();
  }

  private stopDragging(): void {
    if (this.isDragging || this.isDraggingStart || this.isDraggingEnd) {
      this.isDragging = false;
      this.isDraggingStart = false;
      this.isDraggingEnd = false;
      this.emitChange();
    }
  }

  private snapToStep(value: number): number {
    const snapped = Math.round(value / this.step) * this.step;
    return Math.max(this.min, Math.min(this.max, snapped));
  }

  private updateValue(newValue: number): void {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }

  private updateStartValue(newValue: number): void {
    this.startValue = newValue;
    this.startValueChange.emit(this.startValue);
  }

  private updateEndValue(newValue: number): void {
    this.endValue = newValue;
    this.endValueChange.emit(this.endValue);
  }

  private emitChange(): void {
    if (this.range) {
      this.change.emit([this.startValue, this.endValue]);
    } else {
      this.change.emit(this.value);
    }
  }

  onValueChange(newValue: number): void {
    this.updateValue(this.snapToStep(newValue));
    this.emitChange();
  }

  onStartValueChange(newValue: number): void {
    this.updateStartValue(this.snapToStep(newValue));
    this.emitChange();
  }

  onEndValueChange(newValue: number): void {
    this.updateEndValue(this.snapToStep(newValue));
    this.emitChange();
  }

  getSingleProgress(): string {
    const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
    return `${percentage}%`;
  }

  getLeftProgress(): string {
    const percentage = ((this.startValue - this.min) / (this.max - this.min)) * 100;
    return `${percentage}%`;
  }

  getRightProgress(): string {
    const percentage = ((this.endValue - this.min) / (this.max - this.min)) * 100;
    return `${percentage}%`;
  }

  getRangeWidth(): string {
    const percentage = ((this.endValue - this.startValue) / (this.max - this.min)) * 100;
    return `${percentage}%`;
  }

  getMarkPosition(value: number): string {
    const percentage = ((value - this.min) / (this.max - this.min)) * 100;
    return `${percentage}%`;
  }

  formatValue(value: number): string {
    if (this.formatter) {
      return this.formatter(value);
    }
    return value.toString();
  }

  // Helper method to set value
  setValue(value: number): void {
    this.updateValue(this.snapToStep(value));
  }

  // Helper method to set range values
  setRange(start: number, end: number): void {
    this.updateStartValue(this.snapToStep(start));
    this.updateEndValue(this.snapToStep(end));
  }

  // Helper method to get percentage for value
  getPercentage(value: number): number {
    return ((value - this.min) / (this.max - this.min)) * 100;
  }

  // Helper method to get value from percentage
  getValueFromPercentage(percentage: number): number {
    return this.min + (this.max - this.min) * (percentage / 100);
  }

  // Helper method to check if value is within range
  isWithinRange(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  // Helper method to get nearest mark
  getNearestMark(value: number): number {
    if (!this.marks.length) return value;

    return this.marks.reduce((nearest, mark) => {
      return Math.abs(mark.value - value) < Math.abs(nearest - value)
        ? mark.value
        : nearest;
    }, this.marks[0].value);
  }
}