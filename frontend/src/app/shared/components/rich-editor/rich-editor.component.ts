import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EditorCommand {
  icon: string;
  command: string;
  value?: string;
  title: string;
}

@Component({
  selector: 'app-rich-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="border rounded-lg overflow-hidden">
      <!-- Toolbar -->
      <div class="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <!-- Text Style -->
        <div class="flex items-center border-r pr-2 mr-2">
          <select
            class="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            (change)="execCommand('formatBlock', $event)"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="pre">Preformatted</option>
            <option value="blockquote">Quote</option>
          </select>
        </div>

        <!-- Basic Formatting -->
        @for (cmd of basicCommands; track cmd.command) {
          <button
            type="button"
            [title]="cmd.title"
            class="p-2 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            [class.bg-gray-200]="isCommandActive(cmd.command)"
            (click)="execCommand(cmd.command)"
          >
            <i [class]="cmd.icon"></i>
          </button>
        }

        <!-- Alignment -->
        <div class="border-l pl-2 ml-2 flex items-center">
          @for (cmd of alignmentCommands; track cmd.command) {
            <button
              type="button"
              [title]="cmd.title"
              class="p-2 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              [class.bg-gray-200]="isCommandActive(cmd.command)"
              (click)="execCommand(cmd.command)"
            >
              <i [class]="cmd.icon"></i>
            </button>
          }
        </div>

        <!-- Lists -->
        <div class="border-l pl-2 ml-2 flex items-center">
          @for (cmd of listCommands; track cmd.command) {
            <button
              type="button"
              [title]="cmd.title"
              class="p-2 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              [class.bg-gray-200]="isCommandActive(cmd.command)"
              (click)="execCommand(cmd.command)"
            >
              <i [class]="cmd.icon"></i>
            </button>
          }
        </div>

        <!-- Insert -->
        <div class="border-l pl-2 ml-2 flex items-center">
          <!-- Link -->
          <button
            type="button"
            title="Insert Link"
            class="p-2 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            (click)="insertLink()"
          >
            <i class="fas fa-link"></i>
          </button>

          <!-- Image -->
          <button
            type="button"
            title="Insert Image"
            class="p-2 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            (click)="insertImage()"
          >
            <i class="fas fa-image"></i>
          </button>
        </div>

        <!-- Clear Formatting -->
        <div class="border-l pl-2 ml-2">
          <button
            type="button"
            title="Clear Formatting"
            class="p-2 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            (click)="execCommand('removeFormat')"
          >
            <i class="fas fa-remove-format"></i>
          </button>
        </div>
      </div>

      <!-- Editor Content -->
      <div
        #editor
        class="p-4 min-h-[200px] focus:outline-none"
        [class]="getEditorClasses()"
        contenteditable="true"
        [innerHTML]="content"
        (input)="onContentChange($event)"
        (blur)="onBlur()"
      ></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    [contenteditable] {
      outline: none;
    }
  `]
})
export class RichEditorComponent {
  @ViewChild('editor') editorElement!: ElementRef;

  @Input() content = '';
  @Input() placeholder = 'Start typing...';
  @Input() minHeight = '200px';
  @Input() disabled = false;

  @Output() contentChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  basicCommands: EditorCommand[] = [
    { icon: 'fas fa-bold', command: 'bold', title: 'Bold' },
    { icon: 'fas fa-italic', command: 'italic', title: 'Italic' },
    { icon: 'fas fa-underline', command: 'underline', title: 'Underline' },
    { icon: 'fas fa-strikethrough', command: 'strikeThrough', title: 'Strike Through' }
  ];

  alignmentCommands: EditorCommand[] = [
    { icon: 'fas fa-align-left', command: 'justifyLeft', title: 'Align Left' },
    { icon: 'fas fa-align-center', command: 'justifyCenter', title: 'Align Center' },
    { icon: 'fas fa-align-right', command: 'justifyRight', title: 'Align Right' },
    { icon: 'fas fa-align-justify', command: 'justifyFull', title: 'Justify' }
  ];

  listCommands: EditorCommand[] = [
    { icon: 'fas fa-list-ul', command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: 'fas fa-list-ol', command: 'insertOrderedList', title: 'Numbered List' }
  ];

  execCommand(command: string, event?: Event): void {
    if (event) {
      const select = event.target as HTMLSelectElement;
      document.execCommand('formatBlock', false, `<${select.value}>`);
    } else {
      document.execCommand(command, false);
    }
    this.emitContentChange();
  }

  insertLink(): void {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
    this.emitContentChange();
  }

  insertImage(): void {
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
    this.emitContentChange();
  }

  isCommandActive(command: string): boolean {
    return document.queryCommandState(command);
  }

  onContentChange(event: Event): void {
    const target = event.target as HTMLElement;
    this.content = target.innerHTML;
    this.emitContentChange();
  }

  onBlur(): void {
    this.blur.emit();
  }

  getEditorClasses(): string {
    return `
      prose max-w-none
      ${this.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    `.trim();
  }

  private emitContentChange(): void {
    this.contentChange.emit(this.editorElement.nativeElement.innerHTML);
  }

  // Helper method to get selected text
  getSelectedText(): string {
    const selection = window.getSelection();
    return selection ? selection.toString() : '';
  }

  // Helper method to get selected HTML
  getSelectedHtml(): string {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return '';
    
    const container = document.createElement('div');
    const range = selection.getRangeAt(0);
    container.appendChild(range.cloneContents());
    return container.innerHTML;
  }

  // Helper method to insert HTML at cursor
  insertHtml(html: string): void {
    document.execCommand('insertHTML', false, html);
    this.emitContentChange();
  }

  // Helper method to set cursor position
  setCursorPosition(element: HTMLElement, position: number): void {
    const range = document.createRange();
    const selection = window.getSelection();
    
    range.setStart(element.childNodes[0], position);
    range.collapse(true);
    
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  // Helper method to focus editor
  focus(): void {
    this.editorElement.nativeElement.focus();
  }

  // Helper method to clear content
  clear(): void {
    this.content = '';
    this.editorElement.nativeElement.innerHTML = '';
    this.emitContentChange();
  }

  // Helper method to get plain text
  getPlainText(): string {
    return this.editorElement.nativeElement.innerText;
  }

  // Helper method to check if editor is empty
  isEmpty(): boolean {
    const content = this.editorElement.nativeElement.innerText.trim();
    return content === '' || content === this.placeholder;
  }
}