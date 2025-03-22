import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StrengthRule {
  name: string;
  test: (password: string) => boolean;
  message: string;
}

interface StrengthLevel {
  label: string;
  color: string;
  minScore: number;
}

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <!-- Strength Meter -->
      <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full transition-all duration-300 rounded-full"
          [style.width]="getStrengthPercentage()"
          [style.backgroundColor]="getCurrentLevel().color"
        ></div>
      </div>

      <!-- Strength Label -->
      @if (showLabel) {
        <div class="flex items-center justify-between text-sm">
          <span 
            class="font-medium"
            [style.color]="getCurrentLevel().color"
          >
            {{ getCurrentLevel().label }}
          </span>
          <span class="text-gray-500">
            Score: {{ score }}/{{ maxScore }}
          </span>
        </div>
      }

      <!-- Rules Checklist -->
      @if (showRules) {
        <div class="space-y-1">
          @for (rule of rules; track rule.name) {
            <div class="flex items-center text-sm">
              <i 
                class="fas mr-2"
                [class.fa-check-circle]="rule.test(password)"
                [class.fa-times-circle]="!rule.test(password)"
                [class.text-green-500]="rule.test(password)"
                [class.text-red-500]="!rule.test(password)"
              ></i>
              <span 
                [class.text-green-700]="rule.test(password)"
                [class.text-red-700]="!rule.test(password)"
              >
                {{ rule.message }}
              </span>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class PasswordStrengthComponent {
  @Input() password = '';
  @Input() showLabel = true;
  @Input() showRules = true;
  @Input() minLength = 8;

  @Output() strengthChange = new EventEmitter<number>();

  rules: StrengthRule[] = [
    {
      name: 'minLength',
      test: (password: string) => password.length >= this.minLength,
      message: `At least ${this.minLength} characters long`
    },
    {
      name: 'lowercase',
      test: (password: string) => /[a-z]/.test(password),
      message: 'Contains lowercase letters'
    },
    {
      name: 'uppercase',
      test: (password: string) => /[A-Z]/.test(password),
      message: 'Contains uppercase letters'
    },
    {
      name: 'numbers',
      test: (password: string) => /\d/.test(password),
      message: 'Contains numbers'
    },
    {
      name: 'symbols',
      test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      message: 'Contains special characters'
    }
  ];

  levels: StrengthLevel[] = [
    { label: 'Very Weak', color: '#ef4444', minScore: 0 },
    { label: 'Weak', color: '#f97316', minScore: 2 },
    { label: 'Fair', color: '#eab308', minScore: 3 },
    { label: 'Good', color: '#22c55e', minScore: 4 },
    { label: 'Strong', color: '#15803d', minScore: 5 }
  ];

  get score(): number {
    return this.rules.filter(rule => rule.test(this.password)).length;
  }

  get maxScore(): number {
    return this.rules.length;
  }

  ngOnChanges(): void {
    this.strengthChange.emit(this.score);
  }

  getCurrentLevel(): StrengthLevel {
    return this.levels.findLast(level => this.score >= level.minScore) || this.levels[0];
  }

  getStrengthPercentage(): string {
    return `${(this.score / this.maxScore) * 100}%`;
  }

  // Helper method to check if password meets minimum requirements
  meetsMinimumRequirements(): boolean {
    return this.score >= Math.ceil(this.maxScore / 2);
  }

  // Helper method to add custom rule
  addRule(rule: StrengthRule): void {
    this.rules.push(rule);
  }

  // Helper method to remove rule
  removeRule(ruleName: string): void {
    this.rules = this.rules.filter(rule => rule.name !== ruleName);
  }

  // Helper method to update rule
  updateRule(ruleName: string, updates: Partial<StrengthRule>): void {
    const ruleIndex = this.rules.findIndex(rule => rule.name === ruleName);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    }
  }

  // Helper method to add strength level
  addLevel(level: StrengthLevel): void {
    this.levels.push(level);
    this.sortLevels();
  }

  // Helper method to remove level
  removeLevel(label: string): void {
    this.levels = this.levels.filter(level => level.label !== label);
  }

  // Helper method to update level
  updateLevel(label: string, updates: Partial<StrengthLevel>): void {
    const levelIndex = this.levels.findIndex(level => level.label === label);
    if (levelIndex !== -1) {
      this.levels[levelIndex] = { ...this.levels[levelIndex], ...updates };
      this.sortLevels();
    }
  }

  // Helper method to sort levels by minScore
  private sortLevels(): void {
    this.levels.sort((a, b) => a.minScore - b.minScore);
  }

  // Helper method to get password suggestions
  getPasswordSuggestions(): string[] {
    const suggestions: string[] = [];
    
    this.rules.forEach(rule => {
      if (!rule.test(this.password)) {
        suggestions.push(rule.message);
      }
    });

    return suggestions;
  }

  // Helper method to check specific requirement
  checkRequirement(ruleName: string): boolean {
    const rule = this.rules.find(r => r.name === ruleName);
    return rule ? rule.test(this.password) : false;
  }

  // Helper method to get strength description
  getStrengthDescription(): string {
    const level = this.getCurrentLevel();
    const percentage = Math.round((this.score / this.maxScore) * 100);
    return `Password strength: ${level.label} (${percentage}%)`;
  }

  // Helper method to estimate crack time
  estimateCrackTime(): string {
    // This is a very simplified estimation
    const combinations = Math.pow(95, this.password.length); // 95 printable ASCII characters
    const attemptsPerSecond = 1000000000; // Assume 1 billion attempts per second
    const seconds = combinations / attemptsPerSecond;

    if (seconds < 60) return 'instantly';
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    return `${Math.round(seconds / 31536000)} years`;
  }
}