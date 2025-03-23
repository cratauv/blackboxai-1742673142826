import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SelectOption {
  value: any;
  label: string;
  group?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative" #container>
      <!-- Select Container -->
      <div
        class="relative w-full"
        [class.opacity-50]="disabled"
      >
        <!-- Selected Values Display -->
        <div
          class="min-h-[42px] w-full px-3 py-2 bg-white border rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          [class.border-gray-300]="!isOpen"
          [class.border-primary-500]="isOpen"
          (click)="toggleDropdown()"
        >
          <div class="flex flex-wrap gap-1">
            @if (selectedOptions.length === 0) {
              <span class="text-gray-400">{{ placeholder }}</span>
            }
            @for (option of selectedOptions; track option.value) {
              <span
                class="inline-flex items-center px-2 py-1 rounded-md text-sm bg-primary-100 text-primary-800"
              >
                {{ option.label }}
                @if (!disabled) {
                  <button
                    type="button"
                    class="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none"
                    (click)="removeOption(option, $event)"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                }
              </span>
            }
          </div>
        </div>

        <!-- Dropdown Arrow -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <i
            class="fas fa-chevron-down text-gray-400 transition-transform duration-200"
            [class.transform]="isOpen"
            [class.rotate-180]="isOpen"
          ></i>
        </div>
      </div>

      <!-- Dropdown Menu -->
      @if (isOpen) {
        <div
          class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg"
          [style.maxHeight]="maxHeight"
          [style.overflowY]="'auto'"
        >
          <!-- Search Input -->
          @if (searchable) {
            <div class="p-2 border-b">
              <input
                #searchInput
                type="text"
                class="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                [placeholder]="searchPlaceholder"
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                (click)="$event.stopPropagation()"
              />
            </div>
          }

          <!-- Options List -->
          <div class="py-1">
            @if (showSelectAll && filteredOptions.length > 0) {
              <button
                type="button"
                class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none"
                (click)="toggleSelectAll()"
              >
                <i
                  class="fas mr-2"
                  [class.fa-check-square]="allSelected"
                  [class.fa-square]="!allSelected"
                ></i>
                {{ selectAllText }}
              </button>
              <div class="border-t my-1"></div>
            }

            @if (groupBy) {
              @for (group of getGroups(); track group) {
                <!-- Group Header -->
                <div class="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                  {{ group }}
                </div>

                <!-- Group Options -->
                @for (option of getGroupOptions(group); track option.value) {
                  <button
                    type="button"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none"
                    [class.text-gray-400]="option.disabled"
                    [disabled]="option.disabled"
                    (click)="toggleOption(option)"
                  >
                    <i
                      class="fas mr-2"
                      [class.fa-check-square]="isSelected(option)"
                      [class.fa-square]="!isSelected(option)"
                    ></i>
                    {{ option.label }}
                  </button>
                }
              }
            } @else {
              @for (option of filteredOptions; track option.value) {
                <button
                  type="button"
                  class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none"
                  [class.text-gray-400]="option.disabled"
                  [disabled]="option.disabled"
                  (click)="toggleOption(option)"
                >
                  <i
                    class="fas mr-2"
                    [class.fa-check-square]="isSelected(option)"
                    [class.fa-square]="!isSelected(option)"
                  ></i>
                  {{ option.label }}
                </button>
              }
            }

            <!-- Empty State -->
            @if (filteredOptions.length === 0) {
              <div class="px-4 py-2 text-sm text-gray-500 text-center">
                {{ noOptionsText }}
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class MultiSelectComponent {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('searchInput') searchInput?: ElementRef;

  @Input() options: SelectOption[] = [];
  @Input() value: any[] = [];
  @Input() disabled = false;
  @Input() searchable = true;
  @Input() showSelectAll = true;
  @Input() groupBy = '';
  @Input() placeholder = 'Select options';
  @Input() searchPlaceholder = 'Search...';
  @Input() selectAllText = 'Select All';
  @Input() noOptionsText = 'No options available';
  @Input() maxHeight = '250px';

  @Output() valueChange = new EventEmitter<any[]>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<SelectOption[]>();

  isOpen = false;
  searchQuery = '';
  selectedOptions: SelectOption[] = [];
  filteredOptions: SelectOption[] = [];

  ngOnInit(): void {
    this.initializeSelection();
    this.filterOptions();
  }

  ngOnChanges(): void {
    this.initializeSelection();
    this.filterOptions();
  }

  private initializeSelection(): void {
    this.selectedOptions = this.options.filter(option =>
      this.value.includes(option.value)
    );
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.opened.emit();
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      });
    } else {
      this.closed.emit();
      this.searchQuery = '';
      this.filterOptions();
    }
  }

  onSearch(): void {
    this.filterOptions();
  }

  filterOptions(): void {
    this.filteredOptions = this.options.filter(option => {
      const matchesSearch = !this.searchQuery ||
        option.label.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesSearch && !option.disabled;
    });
  }

  toggleOption(option: SelectOption): void {
    if (option.disabled) return;

    const index = this.selectedOptions.findIndex(o => o.value === option.value);
    if (index === -1) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions.splice(index, 1);
    }

    this.updateValue();
  }

  removeOption(option: SelectOption, event: Event): void {
    event.stopPropagation();
    const index = this.selectedOptions.findIndex(o => o.value === option.value);
    if (index !== -1) {
      this.selectedOptions.splice(index, 1);
      this.updateValue();
    }
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedOptions = this.selectedOptions.filter(option =>
        !this.filteredOptions.some(o => o.value === option.value)
      );
    } else {
      this.selectedOptions = [
        ...this.selectedOptions,
        ...this.filteredOptions.filter(option =>
          !this.selectedOptions.some(o => o.value === option.value)
        )
      ];
    }

    this.updateValue();
  }

  private updateValue(): void {
    this.value = this.selectedOptions.map(option => option.value);
    this.valueChange.emit(this.value);
    this.selectionChange.emit(this.selectedOptions);
  }

  isSelected(option: SelectOption): boolean {
    return this.selectedOptions.some(o => o.value === option.value);
  }

  get allSelected(): boolean {
    return this.filteredOptions.length > 0 &&
      this.filteredOptions.every(option =>
        this.selectedOptions.some(o => o.value === option.value)
      );
  }

  getGroups(): string[] {
    if (!this.groupBy) return [];
    return Array.from(new Set(
      this.filteredOptions
        .map(option => option.group || '')
        .filter(group => group !== '')
    )).sort();
  }

  getGroupOptions(group: string): SelectOption[] {
    return this.filteredOptions.filter(option => option.group === group);
  }

  // Helper method to select option by value
  selectOption(value: any): void {
    const option = this.options.find(o => o.value === value);
    if (option && !option.disabled && !this.isSelected(option)) {
      this.selectedOptions.push(option);
      this.updateValue();
    }
  }

  // Helper method to deselect option by value
  deselectOption(value: any): void {
    const index = this.selectedOptions.findIndex(o => o.value === value);
    if (index !== -1) {
      this.selectedOptions.splice(index, 1);
      this.updateValue();
    }
  }

  // Helper method to select multiple options by values
  selectOptions(values: any[]): void {
    const newOptions = this.options.filter(option =>
      values.includes(option.value) &&
      !option.disabled &&
      !this.isSelected(option)
    );
    this.selectedOptions = [...this.selectedOptions, ...newOptions];
    this.updateValue();
  }

  // Helper method to deselect multiple options by values
  deselectOptions(values: any[]): void {
    this.selectedOptions = this.selectedOptions.filter(option =>
      !values.includes(option.value)
    );
    this.updateValue();
  }

  // Helper method to clear selection
  clearSelection(): void {
    this.selectedOptions = [];
    this.updateValue();
  }

  // Helper method to get selected values
  getSelectedValues(): any[] {
    return this.selectedOptions.map(option => option.value);
  }

  // Helper method to get selected labels
  getSelectedLabels(): string[] {
    return this.selectedOptions.map(option => option.label);
  }

  // Helper method to check if has selection
  hasSelection(): boolean {
    return this.selectedOptions.length > 0;
  }

  // Helper method to get selection count
  getSelectionCount(): number {
    return this.selectedOptions.length;
  }
}