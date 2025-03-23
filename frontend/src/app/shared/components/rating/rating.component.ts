import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center">
      <!-- Stars -->
      <div class="flex">
        @for (star of stars; track star.value) {
          <button
            type="button"
            class="p-0.5 focus:outline-none"
            [class.cursor-pointer]="!readonly"
            [class.cursor-default]="readonly"
            (click)="onStarClick(star.value)"
            (mouseenter)="onStarHover(star.value)"
            (mouseleave)="onStarLeave()"
          >
            <i
              [class]="getStarClasses(star)"
              [style.fontSize]="size + 'px'"
            ></i>
          </button>
        }
      </div>

      <!-- Label -->
      @if (showLabel) {
        <span
          [class]="getLabelClasses()"
          [style.marginLeft.px]="labelSpacing"
        >
          {{ getLabel() }}
        </span>
      }

      <!-- Review Count -->
      @if (showCount && reviewCount !== undefined) {
        <span class="ml-1 text-gray-500" [class]="getCountClasses()">
          ({{ reviewCount }})
        </span>
      }
    </div>
  `
})
export class RatingComponent {
  @Input() value = 0;
  @Input() maxValue = 5;
  @Input() size = 20;
  @Input() color = '#FCD34D'; // Tailwind yellow-300
  @Input() inactiveColor = '#E5E7EB'; // Tailwind gray-200
  @Input() hoverColor = '#FBBF24'; // Tailwind yellow-400
  @Input() readonly = false;
  @Input() showLabel = false;
  @Input() showCount = false;
  @Input() reviewCount?: number;
  @Input() labelSpacing = 8;
  @Input() precision = 0.5;
  @Input() labels: Record<number, string> = {
    0: 'No rating',
    1: 'Poor',
    2: 'Fair',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  @Output() ratingChange = new EventEmitter<number>();
  @Output() ratingHover = new EventEmitter<number>();

  hoveredValue: number | null = null;
  stars: { value: number }[] = [];

  constructor() {
    this.initializeStars();
  }

  private initializeStars(): void {
    this.stars = Array.from({ length: this.maxValue }, (_, index) => ({
      value: index + 1
    }));
  }

  getStarClasses(star: { value: number }): string {
    const displayValue = this.hoveredValue ?? this.value;
    const isPartialStar = displayValue % 1 !== 0 && Math.ceil(displayValue) === star.value;
    const isFilled = star.value <= displayValue;

    return `
      fas
      ${isPartialStar ? 'fa-star-half-alt' : 'fa-star'}
      ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
      transition-colors duration-150
    `;
  }

  getLabelClasses(): string {
    return `text-sm font-medium ${this.getTextColorClass()}`;
  }

  getCountClasses(): string {
    const sizeMap = {
      16: 'text-xs',
      20: 'text-sm',
      24: 'text-base',
      28: 'text-lg'
    };

    return sizeMap[this.size as keyof typeof sizeMap] || 'text-sm';
  }

  getTextColorClass(): string {
    const value = this.hoveredValue ?? this.value;
    if (value >= 4) return 'text-success-600';
    if (value >= 2.5) return 'text-warning-600';
    return value > 0 ? 'text-error-600' : 'text-gray-500';
  }

  getLabel(): string {
    const value = Math.round(this.hoveredValue ?? this.value);
    return this.labels[value] || '';
  }

  onStarClick(value: number): void {
    if (!this.readonly) {
      const newValue = this.calculateValue(value);
      if (newValue !== this.value) {
        this.value = newValue;
        this.ratingChange.emit(this.value);
      }
    }
  }

  onStarHover(value: number): void {
    if (!this.readonly) {
      this.hoveredValue = this.calculateValue(value);
      this.ratingHover.emit(this.hoveredValue);
    }
  }

  onStarLeave(): void {
    this.hoveredValue = null;
    if (!this.readonly) {
      this.ratingHover.emit(this.value);
    }
  }

  private calculateValue(value: number): number {
    const rect = event?.target?.getBoundingClientRect();
    if (rect && event instanceof MouseEvent) {
      const starWidth = rect.width;
      const offsetX = event.clientX - rect.left;
      const percentage = offsetX / starWidth;

      if (this.precision === 1) {
        return value;
      } else if (this.precision === 0.5) {
        return percentage <= 0.5 ? value - 0.5 : value;
      } else {
        return value - 1 + percentage;
      }
    }
    return value;
  }

  // Helper method to set value
  setValue(value: number): void {
    this.value = Math.min(Math.max(value, 0), this.maxValue);
  }

  // Helper method to set max value
  setMaxValue(maxValue: number): void {
    this.maxValue = maxValue;
    this.initializeStars();
  }

  // Helper method to set size
  setSize(size: number): void {
    this.size = size;
  }

  // Helper method to set colors
  setColors(color: string, inactiveColor: string, hoverColor: string): void {
    this.color = color;
    this.inactiveColor = inactiveColor;
    this.hoverColor = hoverColor;
  }

  // Helper method to set readonly
  setReadonly(readonly: boolean): void {
    this.readonly = readonly;
  }

  // Helper method to set precision
  setPrecision(precision: number): void {
    this.precision = precision;
  }

  // Helper method to set labels
  setLabels(labels: Record<number, string>): void {
    this.labels = labels;
  }

  // Helper method to set review count
  setReviewCount(count: number): void {
    this.reviewCount = count;
  }

  // Helper method to toggle label
  toggleLabel(show: boolean): void {
    this.showLabel = show;
  }

  // Helper method to toggle count
  toggleCount(show: boolean): void {
    this.showCount = show;
  }

  // Helper method to reset
  reset(): void {
    this.value = 0;
    this.hoveredValue = null;
    this.ratingChange.emit(this.value);
  }

  // Helper method to get percentage
  getPercentage(): number {
    return (this.value / this.maxValue) * 100;
  }

  // Helper method to check if rated
  isRated(): boolean {
    return this.value > 0;
  }

  // Helper method to get rounded value
  getRoundedValue(): number {
    return Math.round(this.value / this.precision) * this.precision;
  }
}