import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface KanbanColumn {
  id: string | number;
  title: string;
  color?: string;
  tasks: KanbanTask[];
}

interface KanbanTask {
  id: string | number;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  color?: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full">
      <!-- Board Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
        @if (showAddColumn) {
          <button
            type="button"
            class="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-md"
            (click)="onAddColumn()"
          >
            <i class="fas fa-plus mr-1"></i>
            Add Column
          </button>
        }
      </div>

      <!-- Board Content -->
      <div class="flex space-x-4 overflow-x-auto pb-4">
        @for (column of columns; track column.id) {
          <div
            class="flex-shrink-0 w-72 bg-gray-100 rounded-lg"
            [class]="getColumnClasses(column)"
          >
            <!-- Column Header -->
            <div class="p-3 flex items-center justify-between">
              <h3 class="font-medium text-gray-900">
                {{ column.title }}
                <span class="ml-2 text-sm text-gray-500">
                  {{ column.tasks.length }}
                </span>
              </h3>
              <div class="flex items-center space-x-2">
                @if (showAddTask) {
                  <button
                    type="button"
                    class="p-1 text-gray-500 hover:text-gray-700 rounded-md"
                    (click)="onAddTask(column)"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                }
                @if (showColumnActions) {
                  <button
                    type="button"
                    class="p-1 text-gray-500 hover:text-gray-700 rounded-md"
                    (click)="onColumnAction(column)"
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                }
              </div>
            </div>

            <!-- Tasks -->
            <div
              class="p-2 space-y-2"
              (dragover)="onDragOver($event)"
              (drop)="onDrop($event, column)"
            >
              @for (task of column.tasks; track task.id) {
                <div
                  class="bg-white p-3 rounded-md shadow-sm cursor-move"
                  [class]="getTaskClasses(task)"
                  draggable="true"
                  (dragstart)="onDragStart($event, task, column)"
                  (click)="onTaskClick(task)"
                >
                  <!-- Task Content -->
                  <h4 class="font-medium text-gray-900">{{ task.title }}</h4>
                  @if (task.description) {
                    <p class="mt-1 text-sm text-gray-500 line-clamp-2">
                      {{ task.description }}
                    </p>
                  }

                  <!-- Task Footer -->
                  <div class="mt-2 flex items-center justify-between">
                    <!-- Assignee -->
                    @if (task.assignee) {
                      <div class="flex items-center">
                        <span class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                          {{ getInitials(task.assignee) }}
                        </span>
                      </div>
                    }

                    <!-- Due Date -->
                    @if (task.dueDate) {
                      <div class="text-xs text-gray-500">
                        {{ formatDate(task.dueDate) }}
                      </div>
                    }

                    <!-- Priority -->
                    @if (task.priority) {
                      <div
                        class="px-2 py-1 text-xs rounded-full"
                        [class]="getPriorityClasses(task.priority)"
                      >
                        {{ task.priority }}
                      </div>
                    }
                  </div>

                  <!-- Tags -->
                  @if (task.tags?.length) {
                    <div class="mt-2 flex flex-wrap gap-1">
                      @for (tag of task.tags; track tag) {
                        <span class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {{ tag }}
                        </span>
                      }
                    </div>
                  }
                </div>
              }

              <!-- Empty State -->
              @if (column.tasks.length === 0) {
                <div class="p-4 text-center text-sm text-gray-500">
                  No tasks
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class KanbanComponent {
  @Input() title = 'Kanban Board';
  @Input() columns: KanbanColumn[] = [];
  @Input() showAddColumn = true;
  @Input() showAddTask = true;
  @Input() showColumnActions = true;

  @Output() columnAdd = new EventEmitter<void>();
  @Output() columnAction = new EventEmitter<KanbanColumn>();
  @Output() taskAdd = new EventEmitter<KanbanColumn>();
  @Output() taskClick = new EventEmitter<KanbanTask>();
  @Output() taskMove = new EventEmitter<{
    task: KanbanTask;
    fromColumn: KanbanColumn;
    toColumn: KanbanColumn;
  }>();

  private draggedTask?: KanbanTask;
  private sourceColumn?: KanbanColumn;

  getColumnClasses(column: KanbanColumn): string {
    return column.color ? `border-t-4 border-${column.color}-500` : '';
  }

  getTaskClasses(task: KanbanTask): string {
    return `
      ${task.color ? `border-l-4 border-${task.color}-500` : ''}
      hover:shadow-md
      transition-shadow
    `;
  }

  getPriorityClasses(priority: string): string {
    const classes = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return classes[priority as keyof typeof classes] || '';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  onAddColumn(): void {
    this.columnAdd.emit();
  }

  onColumnAction(column: KanbanColumn): void {
    this.columnAction.emit(column);
  }

  onAddTask(column: KanbanColumn): void {
    this.taskAdd.emit(column);
  }

  onTaskClick(task: KanbanTask): void {
    this.taskClick.emit(task);
  }

  onDragStart(event: DragEvent, task: KanbanTask, column: KanbanColumn): void {
    this.draggedTask = task;
    this.sourceColumn = column;
    event.dataTransfer?.setData('text/plain', ''); // Required for Firefox
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetColumn: KanbanColumn): void {
    event.preventDefault();

    if (this.draggedTask && this.sourceColumn && targetColumn !== this.sourceColumn) {
      // Remove from source column
      this.sourceColumn.tasks = this.sourceColumn.tasks.filter(
        task => task.id !== this.draggedTask?.id
      );

      // Add to target column
      targetColumn.tasks.push(this.draggedTask);

      // Emit move event
      this.taskMove.emit({
        task: this.draggedTask,
        fromColumn: this.sourceColumn,
        toColumn: targetColumn
      });

      // Reset drag state
      this.draggedTask = undefined;
      this.sourceColumn = undefined;
    }
  }

  // Helper method to add column
  addColumn(column: KanbanColumn): void {
    this.columns = [...this.columns, column];
  }

  // Helper method to remove column
  removeColumn(columnId: string | number): void {
    this.columns = this.columns.filter(column => column.id !== columnId);
  }

  // Helper method to update column
  updateColumn(columnId: string | number, updates: Partial<KanbanColumn>): void {
    this.columns = this.columns.map(column =>
      column.id === columnId ? { ...column, ...updates } : column
    );
  }

  // Helper method to add task
  addTask(columnId: string | number, task: KanbanTask): void {
    this.columns = this.columns.map(column =>
      column.id === columnId
        ? { ...column, tasks: [...column.tasks, task] }
        : column
    );
  }

  // Helper method to remove task
  removeTask(columnId: string | number, taskId: string | number): void {
    this.columns = this.columns.map(column =>
      column.id === columnId
        ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
        : column
    );
  }

  // Helper method to update task
  updateTask(columnId: string | number, taskId: string | number, updates: Partial<KanbanTask>): void {
    this.columns = this.columns.map(column =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : column
    );
  }

  // Helper method to move task
  moveTask(taskId: string | number, fromColumnId: string | number, toColumnId: string | number): void {
    const fromColumn = this.columns.find(column => column.id === fromColumnId);
    const toColumn = this.columns.find(column => column.id === toColumnId);
    const task = fromColumn?.tasks.find(task => task.id === taskId);

    if (fromColumn && toColumn && task) {
      this.removeTask(fromColumnId, taskId);
      this.addTask(toColumnId, task);
    }
  }

  // Helper method to get column by id
  getColumn(columnId: string | number): KanbanColumn | undefined {
    return this.columns.find(column => column.id === columnId);
  }

  // Helper method to get task by id
  getTask(taskId: string | number): KanbanTask | undefined {
    for (const column of this.columns) {
      const task = column.tasks.find(task => task.id === taskId);
      if (task) return task;
    }
    return undefined;
  }

  // Helper method to get tasks by tag
  getTasksByTag(tag: string): KanbanTask[] {
    const tasks: KanbanTask[] = [];
    this.columns.forEach(column => {
      tasks.push(...column.tasks.filter(task => task.tags?.includes(tag)));
    });
    return tasks;
  }

  // Helper method to get tasks by assignee
  getTasksByAssignee(assignee: string): KanbanTask[] {
    const tasks: KanbanTask[] = [];
    this.columns.forEach(column => {
      tasks.push(...column.tasks.filter(task => task.assignee === assignee));
    });
    return tasks;
  }
}