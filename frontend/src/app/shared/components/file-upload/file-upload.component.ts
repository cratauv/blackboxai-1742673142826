import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <!-- Upload Area -->
      <div
        class="relative flex flex-col items-center justify-center w-full"
        [class.cursor-pointer]="!disabled"
        [class.opacity-50]="disabled"
      >
        <!-- Hidden File Input -->
        <input
          #fileInput
          type="file"
          class="hidden"
          [accept]="accept"
          [multiple]="multiple"
          [disabled]="disabled"
          (change)="onFileSelected($event)"
        />

        <!-- Drag & Drop Zone -->
        <div
          class="w-full border-2 border-dashed rounded-lg p-8 text-center"
          [class.border-primary-400]="isDragging"
          [class.bg-primary-50]="isDragging"
          [class.border-gray-300]="!isDragging"
          [class.hover:border-primary-400]="!disabled"
          [class.hover:bg-gray-50]="!disabled"
          (click)="!disabled && fileInput.click()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
        >
          <!-- Upload Icon -->
          <div class="mx-auto mb-4">
            <i 
              class="fas fa-cloud-upload-alt text-4xl"
              [class.text-primary-600]="isDragging"
              [class.text-gray-400]="!isDragging"
            ></i>
          </div>

          <!-- Upload Text -->
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500">
            {{ acceptText }}
          </p>
          @if (maxSize) {
            <p class="text-xs text-gray-500">
              Max file size: {{ formatSize(maxSize) }}
            </p>
          }
        </div>
      </div>

      <!-- File List -->
      @if (files.length > 0) {
        <ul class="mt-4 space-y-2">
          @for (file of files; track file.id) {
            <li class="relative bg-white rounded-lg border p-4">
              <div class="flex items-center justify-between">
                <!-- File Info -->
                <div class="flex items-center min-w-0 flex-1">
                  <!-- File Icon -->
                  <i 
                    class="fas"
                    [class.fa-file-image]="isImageFile(file.file)"
                    [class.fa-file-pdf]="isPdfFile(file.file)"
                    [class.fa-file-alt]="!isImageFile(file.file) && !isPdfFile(file.file)"
                    class="text-gray-400 mr-3"
                  ></i>

                  <!-- File Details -->
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ file.file.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ formatSize(file.file.size) }}
                    </p>
                  </div>
                </div>

                <!-- Status/Actions -->
                <div class="ml-4 flex items-center space-x-2">
                  <!-- Progress -->
                  @if (file.status === 'uploading') {
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-primary-600 h-2 rounded-full"
                        [style.width.%]="file.progress"
                      ></div>
                    </div>
                  }

                  <!-- Status Icon -->
                  @if (file.status === 'success') {
                    <i class="fas fa-check-circle text-green-500"></i>
                  } @else if (file.status === 'error') {
                    <i class="fas fa-exclamation-circle text-red-500"></i>
                  }

                  <!-- Remove Button -->
                  <button
                    type="button"
                    (click)="removeFile(file)"
                    class="text-gray-400 hover:text-gray-500"
                    [class.cursor-not-allowed]="disabled"
                    [disabled]="disabled"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <!-- Error Message -->
              @if (file.status === 'error' && file.error) {
                <p class="mt-2 text-xs text-red-600">
                  {{ file.error }}
                </p>
              }
            </li>
          }
        </ul>
      }
    </div>
  `
})
export class FileUploadComponent {
  @Input() accept = '*/*';
  @Input() multiple = false;
  @Input() maxSize?: number; // in bytes
  @Input() disabled = false;
  @Input() maxFiles = 10;

  @Output() filesChange = new EventEmitter<File[]>();
  @Output() fileRemoved = new EventEmitter<File>();
  @Output() error = new EventEmitter<string>();

  files: UploadedFile[] = [];
  isDragging = false;

  get acceptText(): string {
    if (this.accept === '*/*') return 'All file types accepted';
    return `Accepted file types: ${this.accept}`;
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragging = true;
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  handleFiles(newFiles: File[]): void {
    // Check max files limit
    if (this.files.length + newFiles.length > this.maxFiles) {
      this.error.emit(`Maximum ${this.maxFiles} files allowed`);
      return;
    }

    // Process each file
    newFiles.forEach(file => {
      // Check file type
      if (!this.isValidFileType(file)) {
        this.error.emit(`File type not accepted: ${file.name}`);
        return;
      }

      // Check file size
      if (this.maxSize && file.size > this.maxSize) {
        this.error.emit(`File too large: ${file.name}`);
        return;
      }

      // Add file to list
      this.files.push({
        file,
        id: this.generateId(),
        progress: 0,
        status: 'pending'
      });
    });

    // Emit updated files
    this.emitFiles();
  }

  removeFile(file: UploadedFile): void {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
      this.fileRemoved.emit(file.file);
      this.emitFiles();
    }
  }

  private emitFiles(): void {
    this.filesChange.emit(this.files.map(f => f.file));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2);
  }

  private isValidFileType(file: File): boolean {
    if (this.accept === '*/*') return true;
    const acceptedTypes = this.accept.split(',').map(type => type.trim());
    return acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(new RegExp(type.replace('*', '.*')));
    });
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  isPdfFile(file: File): boolean {
    return file.type === 'application/pdf';
  }

  // Helper method to update file status
  updateFileStatus(fileId: string, status: UploadedFile['status'], progress = 0): void {
    const file = this.files.find(f => f.id === fileId);
    if (file) {
      file.status = status;
      file.progress = progress;
    }
  }

  // Helper method to set file error
  setFileError(fileId: string, error: string): void {
    const file = this.files.find(f => f.id === fileId);
    if (file) {
      file.status = 'error';
      file.error = error;
    }
  }

  // Helper method to clear all files
  clearFiles(): void {
    this.files = [];
    this.emitFiles();
  }
}