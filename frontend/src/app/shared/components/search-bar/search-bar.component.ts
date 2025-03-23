import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="relative">
      <!-- Search Input -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
        
        <input
          type="search"
          [placeholder]="placeholder"
          [formControl]="searchControl"
          class="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                bg-white text-gray-900 placeholder-gray-500
                transition duration-150 ease-in-out"
          [class.pr-24]="showClearButton"
        />

        <!-- Clear Button -->
        @if (showClearButton && searchControl.value) {
          <button
            type="button"
            (click)="clearSearch()"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times"></i>
          </button>
        }
      </div>

      <!-- Loading Indicator -->
      @if (isLoading) {
        <div class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <div class="flex items-center justify-center text-gray-500">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <span class="ml-2">Searching...</span>
          </div>
        </div>
      }

      <!-- Search Results Preview -->
      @if (showResults && searchResults.length > 0) {
        <div class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          <ul class="py-1">
            @for (result of searchResults; track result.id) {
              <li>
                <button
                  type="button"
                  (click)="selectResult(result)"
                  class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  <div class="flex items-center">
                    @if (result.image) {
                      <img 
                        [src]="result.image" 
                        [alt]="result.title"
                        class="w-10 h-10 object-cover rounded"
                      />
                    }
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">{{ result.title }}</p>
                      @if (result.subtitle) {
                        <p class="text-sm text-gray-500">{{ result.subtitle }}</p>
                      }
                    </div>
                  </div>
                </button>
              </li>
            }
          </ul>

          @if (hasMoreResults) {
            <div class="px-4 py-2 border-t border-gray-200">
              <button
                type="button"
                (click)="viewAllResults()"
                class="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all results
              </button>
            </div>
          }
        </div>
      }

      <!-- No Results Message -->
      @if (showNoResults) {
        <div class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center">
          <p class="text-gray-500">No results found</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Hide browser's default clear button */
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
      display: none;
    }
  `]
})
export class SearchBarComponent {
  @Input() placeholder = 'Search...';
  @Input() showClearButton = true;
  @Input() debounceTime = 300;
  @Input() minChars = 2;
  
  @Input() set results(value: any[]) {
    this.searchResults = value;
    this.showResults = value.length > 0;
    this.showNoResults = this.searchControl.value && value.length === 0 && !this.isLoading;
  }

  @Input() set loading(value: boolean) {
    this.isLoading = value;
    if (value) {
      this.showResults = false;
      this.showNoResults = false;
    }
  }

  @Output() search = new EventEmitter<string>();
  @Output() resultSelected = new EventEmitter<any>();
  @Output() viewAll = new EventEmitter<void>();

  searchControl = new FormControl('');
  searchResults: any[] = [];
  showResults = false;
  showNoResults = false;
  isLoading = false;
  hasMoreResults = false;

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    ).subscribe(value => {
      if (!value || value.length < this.minChars) {
        this.showResults = false;
        this.showNoResults = false;
        return;
      }
      this.search.emit(value);
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.showResults = false;
    this.showNoResults = false;
  }

  selectResult(result: any): void {
    this.resultSelected.emit(result);
    this.showResults = false;
  }

  viewAllResults(): void {
    this.viewAll.emit();
    this.showResults = false;
  }
}