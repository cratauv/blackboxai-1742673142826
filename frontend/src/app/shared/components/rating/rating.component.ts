import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type RatingSymbol = 'star' | 'heart' | 'circle' | 'custom';
type RatingSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="inline-flex items-center"
      [class.opacity-50]="disabled"
      role="radiogroup"
      [attr.aria-label]="label"
    >
      <!-- Rating Symbols -->
      @for (item of ratingArray; track item) {
        <button
          type="button"
          class="focus:outline-none transition-colors duration-200"
          [class]="getSymbolClasses(item)"
          [class.cursor-default]="disabled || readonly"
          [class.cursor-pointer]="!disabled && !readonly"
          [attr.aria-label]="getAriaLabel(item)"
          [attr.aria-checked]="isSelected(item)"
          (click)="onRatingClick(item)"
          (mouseenter)="onRatingHover(item)"
          (mouseleave)="onRatingLeave()"
        >
          @switch (symbol) {
            @case ('star') {
              <i 
                class="fas"
                [class.fa-star]="isSelected(item) || isHovered(item)"
                [class.fa-star-half-alt]="isHalfSelected(item)"
                [class.fa-star-o]="!isSelected(item) && !isHovered(item) && !isHalfSelected(item)"
              ></i>
            }
            @case ('heart') {
              <i 
                class="fas"
                [class.fa-heart]="isSelected(item) || isHovered(item)"
                [class.fa-heart-o]="!isSelected(item) && !isHovered(item)"
              ></i>
            }
            @case ('circle') {
              <i 
                class="fas"
                [class.fa-circle]="isSelected(item) || isHovered(item)"
                [class.fa-circle-o]="!isSelected(item) && !isHovered(item)"
              ></i>
            }
            @case ('custom') {
              <ng-container
                [ngTemplateOutlet]="customSymbol"
                [ngTemplateOutletContext]="{
                  $implicit: item,
                  selected: isSelected(item),
                  hovered: isHovered(item)
                }"
              ></ng-container>
            }
          }
        </button>
      }

      <!-- Rating Label -->
      @if (showValue) {
        <span 
          class="ml-2"
          [class]="getLabelClasses()"
        >
          {{ formatRating(value) }}
        </span>
      }
    </div>
  `
})
export class RatingComponent {
  @Input() value = 0;
  @Input() max = 5;
  @Input() symbol: RatingSymbol = 'star';
  @Input() size: RatingSize = 'md';
  @Input() color = 'primary';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() allowHalf = false;
  @Input() showValue = false;
  @Input() label = 'Rating';
  @Input() customSymbol: any;

  @Output() valueChange = new EventEmitter<number>();
  @Output() hover = new EventEmitter<number>();

  hoveredRating = 0;
  ratingArray: number[] = [];

  ngOnInit(): void {
    this.updateRatingArray();
  }

  ngOnChanges(): void {
    this.updateRatingArray();
  }

  private updateRatingArray(): void {
    this.ratingArray = Array.from({ length: this.max }, (_, i) => i + 1);
  }

  onRatingClick(rating: number): void {
    if (this.disabled || this.readonly) return;

    let newValue = rating;
    if (this.allowHalf) {
      const rect = (event?.target as HTMLElement)?.getBoundingClientRect();
      if (rect && event instanceof MouseEvent) {
        const isLeftHalf = event.clientX - rect.left < rect.width / 2;
        newValue = isLeftHalf ? rating - 0.5 : rating;
      }
    }

    this.value = this.value === newValue ? 0 : newValue;
    this.valueChange.emit(this.value);
  }

  onRatingHover(rating: number): void {
    if (this.disabled || this.readonly) return;
    this.hoveredRating = rating;
    this.hover.emit(rating);
  }

  onRatingLeave(): void {
    if (this.disabled || this.readonly) return;
    this.hoveredRating = 0;
    this.hover.emit(0);
  }

  isSelected(rating: number): boolean {
    return rating <= Math.floor(this.hoveredRating || this.value);
  }

  isHalfSelected(rating: number): boolean {
    return this.allowHalf && rating === Math.ceil(this.value) && this.value % 1 !== 0;
  }

  isHovered(rating: number): boolean {
    return rating <= this.hoveredRating;
  }

  getSymbolClasses(rating: number): string {
    const sizeClasses = {
      sm: 'text-sm p-0.5',
      md: 'text-base p-1',
      lg: 'text-lg p-1.5'
    };

    const colorClasses = {
      primary: 'text-primary-400 hover:text-primary-500',
      success: 'text-green-400 hover:text-green-500',
      warning: 'text-yellow-400 hover:text-yellow-500',
      danger: 'text-red-400 hover:text-red-500'
    };

    const isActive = this.isSelected(rating) || this.isHovered(rating);
    const baseColor = colorClasses[this.color as keyof typeof colorClasses] || colorClasses.primary;
    const activeColor = baseColor.split(' ')[0];
    const hoverColor = !this.disabled && !this.readonly ? baseColor.split(' ')[1] : '';

    return `
      ${sizeClasses[this.size]}
      ${isActive ? activeColor : 'text-gray-300'}
      ${hoverColor}
    `.trim();
  }

  getLabelClasses(): string {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    return `${sizeClasses[this.size]} text-gray-600`;
  }

  getAriaLabel(rating: number): string {
    return `Rate ${rating} out of ${this.max}`;
  }

  formatRating(value: number): string {
    return this.allowHalf ? value.toFixed(1) : value.toString();
  }

  // Helper method to set value
  setValue(value: number): void {
    if (value >= 0 && value <= this.max) {
      this.value = this.allowHalf ? value : Math.round(value);
      this.valueChange.emit(this.value);
    }
  }

  // Helper method to reset rating
  reset(): void {
    this.setValue(0);
    this.hoveredRating = 0;
  }

  // Helper method to get percentage
  getPercentage(): number {
    return (this.value / this.max) * 100;
  }

  // Helper method to check if rating is empty
  isEmpty(): boolean {
    return this.value === 0;
  }

  // Helper method to check if rating is full
  isFull(): boolean {
    return this.value === this.max;
  }

  // Helper method to get filled symbols count
  getFilledCount(): number {
    return Math.floor(this.value);
  }

  // Helper method to check if has half symbol
  hasHalf(): boolean {
    return this.allowHalf && this.value % 1 !== 0;
  }

  // Helper method to get rating text
  getRatingText(): string {
    if (this.isEmpty()) return 'No rating';
    if (this.isFull()) return 'Perfect';
    return `${this.formatRating(this.value)} out of ${this.max}`;
  }

  // Helper method to get color based on value
  getColorByValue(): string {
    const percentage = this.getPercentage();
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'primary';
    if (percentage >= 40) return 'warning';
    return 'danger';
  }
}