import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div [class]="wrapperClasses">
      <!-- Search Icon -->
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <i class="fas fa-search text-gray-400"></i>
      </div>

      <!-- Search Input -->
      <input
        #searchInput
        type="search"
        [id]="id"
        [placeholder]="placeholder"
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearchTermChange($event)"
        (keyup.enter)="onEnterPress()"
        (focus)="onFocus()"
        (blur)="onBlur()"
        [class]="inputClasses"
        [disabled]="disabled"
        [attr.aria-label]="ariaLabel"
      >

      <!-- Clear Button -->
      @if (searchTerm && showClear) {
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          (click)="clearSearch()"
        >
          <i class="fas fa-times-circle text-gray-400 hover:text-gray-600"></i>
        </button>
      }

      <!-- Loading Spinner -->
      @if (loading) {
        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
          <div class="animate-spin h-5 w-5 text-gray-400">
            <i class="fas fa-circle-notch"></i>
          </div>
        </div>
      }

      <!-- Search Results Dropdown -->
      @if (showResults && results.length > 0) {
        <div
          class="absolute mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto z-50 border border-gray-200"
        >
          @for (result of results; track result.id) {
            <div
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              [class.bg-gray-50]="selectedIndex === results.indexOf(result)"
              (click)="onResultClick(result)"
              (mouseenter)="selectedIndex = results.indexOf(result)"
            >
              <div class="flex items-center">
                @if (result.icon) {
                  <i [class]="result.icon + ' mr-3 text-gray-400'"></i>
                }
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ result.title }}
                  </div>
                  @if (result.subtitle) {
                    <div class="text-sm text-gray-500">
                      {{ result.subtitle }}
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class SearchBarComponent {
  @Input() id = `search-${Math.random().toString(36).substr(2, 9)}`;
  @Input() placeholder = 'Search...';
  @Input() ariaLabel = 'Search';
  @Input() debounceTime = 300;
  @Input() minLength = 2;
  @Input() showClear = true;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() results: SearchResult[] = [];
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'filled' | 'outlined' = 'default';
  @Input() fullWidth = false;

  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
  @Output() resultSelected = new EventEmitter<SearchResult>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchTerm = '';
  showResults = false;
  selectedIndex = -1;
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term.length >= this.minLength) {
        this.search.emit(term);
      }
    });
  }

  get wrapperClasses(): string {
    return `relative ${this.fullWidth ? 'w-full' : ''}`;
  }

  get inputClasses(): string {
    const baseClasses = 'block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-2.5 text-lg'
    };

    const variantClasses = {
      default: 'ring-gray-300 placeholder:text-gray-400 focus:ring-primary-600',
      filled: 'bg-gray-100 ring-gray-200 placeholder:text-gray-500 focus:ring-primary-600',
      outlined: 'bg-transparent ring-gray-300 placeholder:text-gray-400 focus:ring-primary-600'
    };

    const disabledClasses = this.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${disabledClasses}`;
  }

  onSearchTermChange(term: string): void {
    this.searchSubject.next(term.trim());
  }

  onEnterPress(): void {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.results.length) {
      this.onResultClick(this.results[this.selectedIndex]);
    } else {
      this.search.emit(this.searchTerm.trim());
    }
  }

  onFocus(): void {
    this.showResults = true;
    this.focus.emit();
  }

  onBlur(): void {
    // Delay hiding results to allow click events to fire
    setTimeout(() => {
      this.showResults = false;
      this.selectedIndex = -1;
      this.blur.emit();
    }, 200);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.showResults = false;
    this.selectedIndex = -1;
    this.clear.emit();
    this.searchInput.nativeElement.focus();
  }

  onResultClick(result: SearchResult): void {
    this.searchTerm = result.title;
    this.showResults = false;
    this.resultSelected.emit(result);
  }

  // Helper method to focus input
  focus(): void {
    this.searchInput.nativeElement.focus();
  }

  // Helper method to set search term
  setSearchTerm(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term.trim());
  }

  // Helper method to set loading state
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  // Helper method to set results
  setResults(results: SearchResult[]): void {
    this.results = results;
    this.showResults = results.length > 0;
  }

  // Helper method to clear results
  clearResults(): void {
    this.results = [];
    this.showResults = false;
    this.selectedIndex = -1;
  }

  // Helper method to set disabled state
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  // Helper method to get current search term
  getSearchTerm(): string {
    return this.searchTerm;
  }
}

export interface SearchResult {
  id: string | number;
  title: string;
  subtitle?: string;
  icon?: string;
  data?: any;
}