import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FileUploadState {
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <!-- Hidden File Input -->
      <input
        #fileInput
        type="file"
        class="hidden"
        [accept]="accept"
        [multiple]="multiple"
        (change)="onFileSelected($event)"
      >

      <!-- Drop Zone -->
      <div
        class="relative border-2 border-dashed rounded-lg p-6"
        [class]="getDropZoneClasses()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <!-- Upload Icon -->
        <div class="text-center">
          <i
            class="fas fa-cloud-upload-alt text-4xl"
            [class]="getIconClasses()"
          ></i>

          <!-- Upload Text -->
          <p class="mt-4 text-sm font-medium text-gray-900">
            {{ dragActive ? 'Drop files here' : 'Drag and drop files here' }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            or
            <button
              type="button"
              class="font-medium text-primary-600 hover:text-primary-500"
              (click)="openFileDialog()"
            >
              browse
            </button>
            to upload
          </p>

          <!-- File Requirements -->
          @if (maxFileSize || allowedTypes?.length) {
            <p class="mt-2 text-xs text-gray-500">
              @if (maxFileSize) {
                <span>Maximum file size: {{ formatFileSize(maxFileSize) }}</span>
              }
              @if (allowedTypes?.length) {
                <span>
                  {{ maxFileSize ? ' • ' : '' }}
                  Allowed types: {{ allowedTypes.join(', ') }}
                </span>
              }
            </p>
          }
        </div>

        <!-- File List -->
        @if (files.length > 0) {
          <div class="mt-6 border-t border-gray-200">
            <ul class="divide-y divide-gray-200">
              @for (file of files; track file.name) {
                <li class="py-4 flex items-center justify-between">
                  <div class="flex items-center min-w-0 flex-1">
                    <!-- File Icon -->
                    <i
                      class="fas"
                      [class]="getFileIconClass(file.type)"
                    ></i>

                    <!-- File Info -->
                    <div class="ml-3 flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ file.name }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ formatFileSize(file.size) }}
                      </p>
                    </div>

                    <!-- Progress or Status -->
                    <div class="ml-4 flex-shrink-0">
                      @switch (file.status) {
                        @case ('uploading') {
                          <div class="w-24">
                            <div class="bg-gray-200 rounded-full h-1.5">
                              <div
                                class="bg-primary-600 h-1.5 rounded-full transition-all"
                                [style.width.%]="file.progress"
                              ></div>
                            </div>
                            <p class="mt-1 text-xs text-gray-500 text-right">
                              {{ file.progress }}%
                            </p>
                          </div>
                        }
                        @case ('success') {
                          <i class="fas fa-check-circle text-success-500"></i>
                        }
                        @case ('error') {
                          <i
                            class="fas fa-exclamation-circle text-error-500"
                            [title]="file.error"
                          ></i>
                        }
                      }

                      <!-- Remove Button -->
                      <button
                        type="button"
                        class="ml-4 text-gray-400 hover:text-gray-500"
                        (click)="removeFile(file)"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </div>
  `
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input() accept = '*/*';
  @Input() multiple = false;
  @Input() maxFiles = 10;
  @Input() maxFileSize?: number;
  @Input() allowedTypes?: string[];
  @Input() autoUpload = true;

  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() fileRemoved = new EventEmitter<FileUploadState>();
  @Output() uploadProgress = new EventEmitter<{ file: FileUploadState; progress: number }>();
  @Output() uploadSuccess = new EventEmitter<FileUploadState>();
  @Output() uploadError = new EventEmitter<{ file: FileUploadState; error: string }>();

  files: FileUploadState[] = [];
  dragActive = false;

  getDropZoneClasses(): string {
    return `
      ${this.dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white'}
      hover:border-primary-500 hover:bg-primary-50
      transition-colors duration-200
    `;
  }

  getIconClasses(): string {
    return this.dragActive ? 'text-primary-500' : 'text-gray-400';
  }

  getFileIconClass(type: string): string {
    if (type.startsWith('image/')) return 'fa-image text-blue-500';
    if (type.startsWith('video/')) return 'fa-video text-purple-500';
    if (type.startsWith('audio/')) return 'fa-music text-green-500';
    if (type.includes('pdf')) return 'fa-file-pdf text-red-500';
    if (type.includes('word')) return 'fa-file-word text-blue-700';
    if (type.includes('excel')) return 'fa-file-excel text-green-700';
    return 'fa-file text-gray-500';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  openFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
    input.value = '';
  }

  handleFiles(newFiles: File[]): void {
    // Filter files based on constraints
    const validFiles = newFiles.filter(file => {
      if (this.maxFileSize && file.size > this.maxFileSize) {
        this.emitError(file, `File size exceeds maximum of ${this.formatFileSize(this.maxFileSize!)}`);
        return false;
      }

      if (this.allowedTypes && !this.allowedTypes.includes(file.type)) {
        this.emitError(file, 'File type not allowed');
        return false;
      }

      return true;
    });

    // Check max files limit
    if (this.files.length + validFiles.length > this.maxFiles) {
      this.emitError(validFiles[0], `Maximum of ${this.maxFiles} files allowed`);
      return;
    }

    // Add valid files to state
    const fileStates = validFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending' as const
    }));

    this.files.push(...fileStates);
    this.filesSelected.emit(validFiles);

    if (this.autoUpload) {
      fileStates.forEach((state, index) => {
        this.simulateUpload(state, validFiles[index]);
      });
    }
  }

  removeFile(file: FileUploadState): void {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
      this.fileRemoved.emit(file);
    }
  }

  private simulateUpload(state: FileUploadState, file: File): void {
    state.status = 'uploading';
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        state.status = 'success';
        this.uploadSuccess.emit(state);
      }
      state.progress = Math.min(progress, 100);
      this.uploadProgress.emit({ file: state, progress: state.progress });
    }, 500);
  }

  private emitError(file: File, error: string): void {
    const state: FileUploadState = {
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'error',
      error
    };
    this.uploadError.emit({ file: state, error });
  }

  // Helper method to clear all files
  clearFiles(): void {
    this.files = [];
  }

  // Helper method to get file count
  getFileCount(): number {
    return this.files.length;
  }

  // Helper method to check if has files
  hasFiles(): boolean {
    return this.files.length > 0;
  }

  // Helper method to get total upload progress
  getTotalProgress(): number {
    if (this.files.length === 0) return 0;
    return this.files.reduce((sum, file) => sum + file.progress, 0) / this.files.length;
  }

  // Helper method to check if all files are uploaded
  isUploadComplete(): boolean {
    return this.files.every(file => file.status === 'success');
  }

  // Helper method to check if any file has error
  hasErrors(): boolean {
    return this.files.some(file => file.status === 'error');
  }

  // Helper method to get error count
  getErrorCount(): number {
    return this.files.filter(file => file.status === 'error').length;
  }

  // Helper method to retry failed uploads
  retryFailedUploads(): void {
    this.files
      .filter(file => file.status === 'error')
      .forEach(file => {
        file.status = 'pending';
        file.progress = 0;
        file.error = undefined;
        if (this.autoUpload) {
          this.simulateUpload(file, new File([], file.name));
        }
      });
  }
}