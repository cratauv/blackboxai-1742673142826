import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  completed?: boolean;
  optional?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <!-- Steps Navigation -->
      <nav aria-label="Progress">
        <ol 
          class="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
          [class.bg-gray-50]="disabled"
        >
          @for (step of steps; track step.id; let first = $first; let last = $last; let index = $index) {
            <li class="relative md:flex md:flex-1">
              <!-- Step Link -->
              <button
                type="button"
                (click)="onStepClick(step)"
                class="group flex w-full items-center"
                [class.cursor-not-allowed]="!canNavigateToStep(step)"
                [disabled]="!canNavigateToStep(step)"
              >
                <span class="flex items-center px-6 py-4 text-sm font-medium">
                  <!-- Step Number/Icon -->
                  <span 
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                    [class]="getStepNumberClasses(step)"
                  >
                    @if (step.completed) {
                      <i class="fas fa-check"></i>
                    } @else {
                      @if (step.icon) {
                        <i [class]="step.icon"></i>
                      } @else {
                        {{ index + 1 }}
                      }
                    }
                  </span>

                  <!-- Step Title & Subtitle -->
                  <span class="ml-4 text-left">
                    <span 
                      class="font-medium"
                      [class]="getStepTextClasses(step)"
                    >
                      {{ step.title }}
                    </span>
                    @if (step.subtitle) {
                      <span class="text-sm text-gray-500">
                        {{ step.subtitle }}
                      </span>
                    }
                    @if (step.optional) {
                      <span class="text-sm text-gray-500">(Optional)</span>
                    }
                  </span>
                </span>

                <!-- Separator Line -->
                @if (!last) {
                  <div 
                    class="absolute right-0 top-0 hidden h-full w-5 md:block"
                    [class]="getSeparatorClasses(step)"
                  >
                    <svg
                      class="h-full w-full"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        [attr.stroke]="getSeparatorColor(step)"
                        vector-effect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                }
              </button>
            </li>
          }
        </ol>
      </nav>

      <!-- Step Content -->
      <div class="mt-8">
        <ng-content></ng-content>
      </div>

      <!-- Navigation Buttons -->
      @if (showNavigation) {
        <div class="mt-8 flex justify-between">
          <button
            type="button"
            (click)="previous()"
            class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
            [class]="getNavigationButtonClasses('previous')"
            [disabled]="!canGoPrevious()"
          >
            <i class="fas fa-chevron-left mr-2"></i>
            Previous
          </button>

          <button
            type="button"
            (click)="next()"
            class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
            [class]="getNavigationButtonClasses('next')"
            [disabled]="!canGoNext()"
          >
            @if (isLastStep()) {
              Finish
            } @else {
              Next
              <i class="fas fa-chevron-right ml-2"></i>
            }
          </button>
        </div>
      }
    </div>
  `
})
export class StepperComponent {
  @Input() steps: Step[] = [];
  @Input() currentStepId = '';
  @Input() showNavigation = true;
  @Input() disabled = false;
  @Input() linear = true;

  @Output() stepChange = new EventEmitter<string>();
  @Output() complete = new EventEmitter<void>();

  onStepClick(step: Step): void {
    if (this.canNavigateToStep(step)) {
      this.currentStepId = step.id;
      this.stepChange.emit(step.id);
    }
  }

  next(): void {
    const currentIndex = this.getCurrentStepIndex();
    if (currentIndex < this.steps.length - 1) {
      const nextStep = this.steps[currentIndex + 1];
      this.currentStepId = nextStep.id;
      this.stepChange.emit(nextStep.id);
    } else if (currentIndex === this.steps.length - 1) {
      this.complete.emit();
    }
  }

  previous(): void {
    const currentIndex = this.getCurrentStepIndex();
    if (currentIndex > 0) {
      const previousStep = this.steps[currentIndex - 1];
      this.currentStepId = previousStep.id;
      this.stepChange.emit(previousStep.id);
    }
  }

  getCurrentStepIndex(): number {
    return this.steps.findIndex(step => step.id === this.currentStepId);
  }

  isLastStep(): boolean {
    return this.getCurrentStepIndex() === this.steps.length - 1;
  }

  canNavigateToStep(step: Step): boolean {
    if (this.disabled || step.disabled) return false;
    if (!this.linear) return true;

    const stepIndex = this.steps.findIndex(s => s.id === step.id);
    const currentIndex = this.getCurrentStepIndex();

    // Can always go back
    if (stepIndex < currentIndex) return true;

    // Can only go forward if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!this.steps[i].completed && !this.steps[i].optional) {
        return false;
      }
    }

    return true;
  }

  canGoNext(): boolean {
    if (this.disabled) return false;
    const currentIndex = this.getCurrentStepIndex();
    return currentIndex < this.steps.length - 1;
  }

  canGoPrevious(): boolean {
    if (this.disabled) return false;
    return this.getCurrentStepIndex() > 0;
  }

  getStepNumberClasses(step: Step): string {
    if (step.completed) {
      return 'bg-primary-600 text-white';
    }
    if (step.id === this.currentStepId) {
      return 'border-2 border-primary-600 text-primary-600';
    }
    if (step.disabled || !this.canNavigateToStep(step)) {
      return 'border-2 border-gray-300 text-gray-400';
    }
    return 'border-2 border-gray-300 text-gray-500';
  }

  getStepTextClasses(step: Step): string {
    if (step.disabled || !this.canNavigateToStep(step)) {
      return 'text-gray-400';
    }
    if (step.id === this.currentStepId) {
      return 'text-primary-600';
    }
    return 'text-gray-900';
  }

  getSeparatorClasses(step: Step): string {
    const stepIndex = this.steps.findIndex(s => s.id === step.id);
    const isCompleted = this.steps[stepIndex].completed;
    const isActive = step.id === this.currentStepId;

    if (isCompleted) {
      return 'bg-primary-600';
    }
    if (isActive) {
      return 'bg-primary-200';
    }
    return 'bg-gray-300';
  }

  getSeparatorColor(step: Step): string {
    const stepIndex = this.steps.findIndex(s => s.id === step.id);
    const isCompleted = this.steps[stepIndex].completed;
    const isActive = step.id === this.currentStepId;

    if (isCompleted) {
      return '#2563EB'; // primary-600
    }
    if (isActive) {
      return '#BFDBFE'; // primary-200
    }
    return '#D1D5DB'; // gray-300
  }

  getNavigationButtonClasses(type: 'previous' | 'next'): string {
    const baseClasses = 'transition-colors duration-200';
    const enabledClasses = 'bg-primary-600 text-white hover:bg-primary-700';
    const disabledClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed';

    if (type === 'previous') {
      return `${baseClasses} ${this.canGoPrevious() ? enabledClasses : disabledClasses}`;
    }
    return `${baseClasses} ${this.canGoNext() ? enabledClasses : disabledClasses}`;
  }
}