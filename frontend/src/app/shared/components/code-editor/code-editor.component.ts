import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type EditorTheme = 'light' | 'dark';
type Language = 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'markdown' | 'sql' | 'python';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div 
      class="border rounded-lg overflow-hidden"
      [class.dark]="theme === 'dark'"
    >
      <!-- Editor Header -->
      <div class="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
        <!-- Language Selector -->
        <div class="flex items-center space-x-4">
          <select
            class="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            [ngModel]="language"
            (ngModelChange)="onLanguageChange($event)"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="sql">SQL</option>
            <option value="python">Python</option>
          </select>

          <!-- Line Numbers Toggle -->
          <button
            type="button"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            [class.bg-gray-200]="showLineNumbers"
            (click)="toggleLineNumbers()"
          >
            <i class="fas fa-list-ol"></i>
          </button>

          <!-- Word Wrap Toggle -->
          <button
            type="button"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            [class.bg-gray-200]="wordWrap"
            (click)="toggleWordWrap()"
          >
            <i class="fas fa-wrap-text"></i>
          </button>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <!-- Theme Toggle -->
          <button
            type="button"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            (click)="toggleTheme()"
          >
            <i [class]="theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>

          <!-- Copy Button -->
          <button
            type="button"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            (click)="copyToClipboard()"
          >
            <i class="fas fa-copy"></i>
          </button>

          <!-- Download Button -->
          <button
            type="button"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            (click)="downloadCode()"
          >
            <i class="fas fa-download"></i>
          </button>
        </div>
      </div>

      <!-- Editor Content -->
      <div class="relative">
        <!-- Line Numbers -->
        @if (showLineNumbers) {
          <div 
            class="absolute top-0 left-0 bottom-0 w-12 bg-gray-50 dark:bg-gray-800 border-r text-right select-none"
            [class.dark]="theme === 'dark'"
          >
            @for (line of getLineNumbers(); track line) {
              <div 
                class="px-2 text-xs text-gray-400 dark:text-gray-500 font-mono"
                [style.height]="lineHeight + 'px'"
              >
                {{ line }}
              </div>
            }
          </div>
        }

        <!-- Code Area -->
        <div [class.pl-12]="showLineNumbers">
          <textarea
            #editor
            class="w-full font-mono text-sm p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
            [class.whitespace-pre]="!wordWrap"
            [ngModel]="code"
            (ngModelChange)="onCodeChange($event)"
            [attr.rows]="rows"
            [attr.spellcheck]="false"
            [style.lineHeight]="lineHeight + 'px'"
            [style.minHeight]="minHeight"
          ></textarea>
        </div>
      </div>

      <!-- Editor Footer -->
      @if (showFooter) {
        <div class="flex items-center justify-between px-4 py-2 border-t bg-gray-50 dark:bg-gray-800">
          <!-- Stats -->
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <span>{{ getLineCount() }} lines</span>
            <span class="mx-2">|</span>
            <span>{{ getCharacterCount() }} characters</span>
          </div>

          <!-- Position -->
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Line {{ getCurrentLine() }}, Column {{ getCurrentColumn() }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    textarea {
      resize: vertical;
    }

    .dark {
      color-scheme: dark;
    }
  `]
})
export class CodeEditorComponent {
  @ViewChild('editor') editorElement!: ElementRef<HTMLTextAreaElement>;

  @Input() code = '';
  @Input() language: Language = 'javascript';
  @Input() theme: EditorTheme = 'light';
  @Input() showLineNumbers = true;
  @Input() showFooter = true;
  @Input() wordWrap = true;
  @Input() rows = 10;
  @Input() minHeight = '200px';
  @Input() lineHeight = 20;

  @Output() codeChange = new EventEmitter<string>();
  @Output() languageChange = new EventEmitter<Language>();

  onCodeChange(value: string): void {
    this.code = value;
    this.codeChange.emit(value);
  }

  onLanguageChange(value: Language): void {
    this.language = value;
    this.languageChange.emit(value);
  }

  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  toggleLineNumbers(): void {
    this.showLineNumbers = !this.showLineNumbers;
  }

  toggleWordWrap(): void {
    this.wordWrap = !this.wordWrap;
  }

  getLineNumbers(): number[] {
    const lineCount = this.getLineCount();
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  }

  getLineCount(): number {
    return this.code.split('\n').length;
  }

  getCharacterCount(): number {
    return this.code.length;
  }

  getCurrentLine(): number {
    const textarea = this.editorElement.nativeElement;
    const lines = this.code.slice(0, textarea.selectionStart).split('\n');
    return lines.length;
  }

  getCurrentColumn(): number {
    const textarea = this.editorElement.nativeElement;
    const lines = this.code.slice(0, textarea.selectionStart).split('\n');
    return lines[lines.length - 1].length + 1;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.code);
  }

  downloadCode(): void {
    const blob = new Blob([this.code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${this.getFileExtension()}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Helper method to get file extension
  private getFileExtension(): string {
    const extensions: Record<Language, string> = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md',
      sql: 'sql',
      python: 'py'
    };
    return extensions[this.language];
  }

  // Helper method to insert text at cursor
  insertAtCursor(text: string): void {
    const textarea = this.editorElement.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    this.code = this.code.slice(0, start) + text + this.code.slice(end);
    textarea.focus();
    textarea.setSelectionRange(start + text.length, start + text.length);
  }

  // Helper method to get selected text
  getSelectedText(): string {
    const textarea = this.editorElement.nativeElement;
    return this.code.slice(textarea.selectionStart, textarea.selectionEnd);
  }

  // Helper method to indent selection
  indentSelection(): void {
    const selected = this.getSelectedText();
    const indented = selected.split('\n').map(line => '  ' + line).join('\n');
    this.insertAtCursor(indented);
  }

  // Helper method to unindent selection
  unindentSelection(): void {
    const selected = this.getSelectedText();
    const unindented = selected.split('\n')
      .map(line => line.startsWith('  ') ? line.slice(2) : line)
      .join('\n');
    this.insertAtCursor(unindented);
  }

  // Helper method to format code
  formatCode(): void {
    try {
      let formatted = this.code;
      switch (this.language) {
        case 'json':
          formatted = JSON.stringify(JSON.parse(this.code), null, 2);
          break;
        // Add more formatting options for other languages
      }
      this.code = formatted;
      this.codeChange.emit(formatted);
    } catch (error) {
      console.error('Failed to format code:', error);
    }
  }
}