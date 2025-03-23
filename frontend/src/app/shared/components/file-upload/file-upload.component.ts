import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  preview?: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- Upload Zone -->
      <div
        #dropZone
        class="relative border-2 border-dashed rounded-lg p-6 transition-colors"
        [class.border-gray-300]="!isDragging"
        [class.border-primary-500]="isDragging"
        [class.bg-gray-50]="!isDragging"
        [class.bg-primary-50]="isDragging"
        [class.opacity-50]="disabled"
        (dragenter)="onDragEnter($event)"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <!-- Upload Icon -->
        <div class="text-center">
          <i 
            class="fas fa-cloud-upload-alt text-4xl"
            [class.text-gray-400]="!isDragging"
            [class.text-primary-500]="isDragging"
          ></i>
        </div>

        <!-- Upload Text -->
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Drag and drop files here, or
            <button
              type="button"
              class="text-primary-600 hover:text-primary-700 focus:outline-none"
              [class.cursor-not-allowed]="disabled"
              (click)="openFileDialog()"
            >
              browse
            </button>
            to upload
          </p>
          <p class="mt-1 text-xs text-gray-500">
            {{ getFileTypeText() }}
          </p>
          @if (maxFiles > 0) {
            <p class="mt-1 text-xs text-gray-500">
              Maximum {{ maxFiles }} file{{ maxFiles === 1 ? '' : 's' }}
            </p>
          }
          @if (maxSize > 0) {
            <p class="mt-1 text-xs text-gray-500">
              Maximum size: {{ formatSize(maxSize) }}
            </p>
          }
        </div>

        <!-- Hidden File Input -->
        <input
          #fileInput
          type="file"
          class="hidden"
          [accept]="accept"
          [multiple]="multiple"
          (change)="onFileSelected($event)"
        />
      </div>

      <!-- File List -->
      @if (files.length > 0) {
        <div class="space-y-2">
          @for (file of files; track file.id) {
            <div
              class="flex items-center p-3 bg-white border rounded-lg"
              [class.border-primary-200]="file.status === 'uploading'"
              [class.border-green-200]="file.status === 'success'"
              [class.border-red-200]="file.status === 'error'"
            >
              <!-- File Preview -->
              @if (file.preview) {
                <div class="flex-shrink-0 w-10 h-10 mr-3">
                  <img
                    [src]="file.preview"
                    class="w-full h-full object-cover rounded"
                    alt="File preview"
                  />
                </div>
              } @else {
                <div class="flex-shrink-0 w-10 h-10 mr-3 bg-gray-100 rounded flex items-center justify-center">
                  <i class="fas fa-file text-gray-400"></i>
                </div>
              }

              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ file.file.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatSize(file.file.size) }}
                </p>
              </div>

              <!-- Progress/Status -->
              <div class="ml-4 flex-shrink-0">
                @switch (file.status) {
                  @case ('uploading') {
                    <div class="w-24">
                      <div class="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-primary-500 transition-all duration-300"
                          [style.width.%]="file.progress"
                        ></div>
                      </div>
                      <p class="mt-1 text-xs text-center text-gray-500">
                        {{ file.progress }}%
                      </p>
                    </div>
                  }
                  @case ('success') {
                    <i class="fas fa-check-circle text-green-500"></i>
                  }
                  @case ('error') {
                    <div class="flex items-center">
                      <i class="fas fa-exclamation-circle text-red-500"></i>
                      <button
                        type="button"
                        class="ml-2 text-sm text-primary-600 hover:text-primary-700"
                        (click)="retryUpload(file)"
                      >
                        Retry
                      </button>
                    </div>
                  }
                  @default {
                    <button
                      type="button"
                      class="text-gray-400 hover:text-gray-500"
                      (click)="removeFile(file)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  }
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dropZone') dropZone!: ElementRef<HTMLDivElement>;

  @Input() accept = '*';
  @Input() multiple = true;
  @Input() maxFiles = 0;
  @Input() maxSize = 0; // in bytes
  @Input() disabled = false;
  @Input() showPreviews = true;
  @Input() autoUpload = true;

  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() fileRemoved = new EventEmitter<File>();
  @Output() uploadStart = new EventEmitter<File>();
  @Output() uploadProgress = new EventEmitter<{ file: File; progress: number }>();
  @Output() uploadSuccess = new EventEmitter<File>();
  @Output() uploadError = new EventEmitter<{ file: File; error: string }>();

  files: UploadFile[] = [];
  isDragging = false;

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragging = true;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!event.relatedTarget || !this.dropZone.nativeElement.contains(event.relatedTarget as Node)) {
      this.isDragging = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (this.disabled) return;

    const files = Array.from(event.dataTransfer?.files || []);
    this.handleFiles(files);
  }

  openFileDialog(): void {
    if (!this.disabled) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.handleFiles(files);
    input.value = '';
  }

  private handleFiles(files: File[]): void {
    if (this.maxFiles > 0 && this.files.length + files.length > this.maxFiles) {
      this.emitError(files[0], `Maximum ${this.maxFiles} files allowed`);
      return;
    }

    const validFiles = files.filter(file => {
      if (this.maxSize > 0 && file.size > this.maxSize) {
        this.emitError(file, `File size exceeds ${this.formatSize(this.maxSize)}`);
        return false;
      }

      if (!this.isValidFileType(file)) {
        this.emitError(file, 'File type not allowed');
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    const newFiles = validFiles.map(file => ({
      id: this.generateId(),
      file,
      progress: 0,
      status: 'pending' as const,
      preview: this.showPreviews ? this.getFilePreview(file) : undefined
    }));

    this.files = [...this.files, ...newFiles];
    this.filesSelected.emit(validFiles);

    if (this.autoUpload) {
      newFiles.forEach(file => this.uploadFile(file));
    }
  }

  removeFile(file: UploadFile): void {
    const index = this.files.indexOf(file);
    if (index !== -1) {
      this.files.splice(index, 1);
      this.fileRemoved.emit(file.file);
    }
  }

  retryUpload(file: UploadFile): void {
    file.status = 'pending';
    file.progress = 0;
    file.error = undefined;
    this.uploadFile(file);
  }

  private uploadFile(file: UploadFile): void {
    file.status = 'uploading';
    this.uploadStart.emit(file.file);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      file.progress = progress;
      this.uploadProgress.emit({ file: file.file, progress });

      if (progress >= 100) {
        clearInterval(interval);
        file.status = 'success';
        this.uploadSuccess.emit(file.file);
      }
    }, 500);
  }

  private emitError(file: File, error: string): void {
    this.uploadError.emit({ file, error });
  }

  private isValidFileType(file: File): boolean {
    if (this.accept === '*') return true;
    const acceptedTypes = this.accept.split(',').map(type => type.trim());
    return acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      if (type.includes('/*')) {
        const [baseType] = type.split('/');
        return file.type.startsWith(`${baseType}/`);
      }
      return file.type === type;
    });
  }

  private getFilePreview(file: File): string | undefined {
    if (!file.type.startsWith('image/')) return undefined;
    return URL.createObjectURL(file);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2);
  }

  getFileTypeText(): string {
    if (this.accept === '*') return 'All file types allowed';
    return `Allowed types: ${this.accept}`;
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // Helper method to clear all files
  clear(): void {
    this.files = [];
  }

  // Helper method to start upload
  startUpload(): void {
    this.files
      .filter(file => file.status === 'pending')
      .forEach(file => this.uploadFile(file));
  }

  // Helper method to cancel upload
  cancelUpload(file: UploadFile): void {
    if (file.status === 'uploading') {
      file.status = 'pending';
      file.progress = 0;
    }
  }

  // Helper method to get file count
  getFileCount(): number {
    return this.files.length;
  }

  // Helper method to get total size
  getTotalSize(): number {
    return this.files.reduce((total, file) => total + file.file.size, 0);
  }

  // Helper method to check if has files
  hasFiles(): boolean {
    return this.files.length > 0;
  }

  // Helper method to get upload progress
  getOverallProgress(): number {
    if (this.files.length === 0) return 0;
    return this.files.reduce((total, file) => total + file.progress, 0) / this.files.length;
  }

  // Helper method to check if all files uploaded
  isUploadComplete(): boolean {
    return this.files.every(file => file.status === 'success');
  }

  // Helper method to get failed uploads
  getFailedUploads(): UploadFile[] {
    return this.files.filter(file => file.status === 'error');
  }
}