import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  ratings: number[];
}

export interface FilterValues {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: string;
  inStock?: boolean;
}

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow p-4">
      <form [formGroup]="filterForm">
        <!-- Categories -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Categories</h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                type="radio"
                id="all-categories"
                formControlName="category"
                [value]="''"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label for="all-categories" class="ml-2 text-gray-700">
                All Categories
              </label>
            </div>
            @for (category of options.categories; track category) {
              <div class="flex items-center">
                <input
                  type="radio"
                  [id]="category"
                  formControlName="category"
                  [value]="category"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label [for]="category" class="ml-2 text-gray-700">
                  {{ category }}
                </label>
              </div>
            }
          </div>
        </div>

        <!-- Price Range -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Price Range</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Min Price ($)</label>
              <input
                type="number"
                formControlName="minPrice"
                [min]="options.priceRange.min"
                [max]="options.priceRange.max"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Max Price ($)</label>
              <input
                type="number"
                formControlName="maxPrice"
                [min]="options.priceRange.min"
                [max]="options.priceRange.max"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Rating Filter -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Rating</h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                type="radio"
                id="all-ratings"
                formControlName="rating"
                [value]="0"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label for="all-ratings" class="ml-2 text-gray-700">
                All Ratings
              </label>
            </div>
            @for (rating of options.ratings; track rating) {
              <div class="flex items-center">
                <input
                  type="radio"
                  [id]="'rating-' + rating"
                  formControlName="rating"
                  [value]="rating"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label [for]="'rating-' + rating" class="ml-2 flex items-center text-gray-700">
                  <span class="flex text-yellow-400">
                    @for (star of [1,2,3,4,5]; track star) {
                      <i class="fas fa-star" [class.text-gray-300]="star > rating"></i>
                    }
                  </span>
                  <span class="ml-1">& up</span>
                </label>
              </div>
            }
          </div>
        </div>

        <!-- Availability -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Availability</h3>
          <div class="flex items-center">
            <input
              type="checkbox"
              id="in-stock"
              formControlName="inStock"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
            />
            <label for="in-stock" class="ml-2 text-gray-700">
              In Stock Only
            </label>
          </div>
        </div>

        <!-- Sort By -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Sort By</h3>
          <select
            formControlName="sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <!-- Clear Filters -->
        <button
          type="button"
          (click)="clearFilters()"
          class="w-full px-4 py-2 text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
        >
          Clear All Filters
        </button>
      </form>
    </div>
  `
})
export class ProductFilterComponent {
  @Input() options: FilterOptions = {
    categories: [],
    priceRange: { min: 0, max: 1000 },
    ratings: [4, 3, 2, 1]
  };

  @Output() filterChange = new EventEmitter<FilterValues>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      category: [''],
      minPrice: [null],
      maxPrice: [null],
      rating: [0],
      sortBy: ['relevance'],
      inStock: [false]
    });

    // Subscribe to form changes
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(values => {
      this.filterChange.emit(this.sanitizeValues(values));
    });
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      category: '',
      minPrice: null,
      maxPrice: null,
      rating: 0,
      sortBy: 'relevance',
      inStock: false
    });
  }

  private sanitizeValues(values: FilterValues): FilterValues {
    const sanitized: FilterValues = {};

    if (values.category) {
      sanitized.category = values.category;
    }

    if (values.minPrice !== null && values.minPrice !== undefined) {
      sanitized.minPrice = Math.max(values.minPrice, this.options.priceRange.min);
    }

    if (values.maxPrice !== null && values.maxPrice !== undefined) {
      sanitized.maxPrice = Math.min(values.maxPrice, this.options.priceRange.max);
    }

    if (values.rating) {
      sanitized.rating = values.rating;
    }

    if (values.sortBy && values.sortBy !== 'relevance') {
      sanitized.sortBy = values.sortBy;
    }

    if (values.inStock) {
      sanitized.inStock = values.inStock;
    }

    return sanitized;
  }
}