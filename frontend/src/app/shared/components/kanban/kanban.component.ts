import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
  color?: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full">
      <!-- Board Header -->
      @if (showHeader) {
        <div class="flex items-center justify-between p-4 border-b">
          <div class="flex items-center space-x-4">
            <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
            @if (description) {
              <p class="text-sm text-gray-500">{{ description }}</p>
            }
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <button
              type="button"
              class="px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              (click)="onAddColumn()"
            >
              <i class="fas fa-plus mr-2"></i>
              Add Column
            </button>
          </div>
        </div>
      }

      <!-- Board Content -->
      <div class="flex-1 overflow-x-auto">
        <div class="flex h-full p-4 space-x-4">
          <!-- Columns -->
          @for (column of columns; track column.id) {
            <div
              class="flex flex-col w-72 bg-gray-100 rounded-lg"
              [attr.data-column-id]="column.id"
            >
              <!-- Column Header -->
              <div 
                class="p-3 flex items-center justify-between"
                [style.borderBottomColor]="column.color"
                [style.borderBottomWidth]="'2px'"
              >
                <h3 class="font-medium text-gray-900">
                  {{ column.title }}
                  <span class="ml-2 text-sm text-gray-500">({{ column.tasks.length }})</span>
                </h3>
                <div class="flex items-center">
                  <button
                    type="button"
                    class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    (click)="onAddTask(column)"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                  <button
                    type="button"
                    class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    (click)="onEditColumn(column)"
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>

              <!-- Tasks -->
              <div class="flex-1 p-2 space-y-2 overflow-y-auto">
                @for (task of column.tasks; track task.id) {
                  <div
                    class="bg-white p-3 rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow"
                    [attr.data-task-id]="task.id"
                    (click)="onTaskClick(task)"
                  >
                    <!-- Task Title -->
                    <h4 class="font-medium text-gray-900">{{ task.title }}</h4>

                    <!-- Task Description -->
                    @if (task.description) {
                      <p class="mt-1 text-sm text-gray-500 line-clamp-2">
                        {{ task.description }}
                      </p>
                    }

                    <!-- Task Metadata -->
                    <div class="mt-3 flex items-center justify-between">
                      <!-- Assignee -->
                      @if (task.assignee) {
                        <div class="flex items-center">
                          @if (task.assignee.avatar) {
                            <img
                              [src]="task.assignee.avatar"
                              [alt]="task.assignee.name"
                              class="w-6 h-6 rounded-full"
                            />
                          } @else {
                            <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                              <span class="text-xs text-gray-600">
                                {{ task.assignee.name.charAt(0) }}
                              </span>
                            </div>
                          }
                          <span class="ml-2 text-sm text-gray-600">
                            {{ task.assignee.name }}
                          </span>
                        </div>
                      }

                      <!-- Due Date -->
                      @if (task.dueDate) {
                        <div class="text-sm text-gray-500">
                          <i class="far fa-calendar mr-1"></i>
                          {{ task.dueDate | date:'shortDate' }}
                        </div>
                      }
                    </div>

                    <!-- Tags -->
                    @if (task.tags?.length) {
                      <div class="mt-2 flex flex-wrap gap-1">
                        @for (tag of task.tags; track tag) {
                          <span class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                            {{ tag }}
                          </span>
                        }
                      </div>
                    }

                    <!-- Priority -->
                    @if (task.priority) {
                      <div class="mt-2">
                        <span 
                          class="px-2 py-0.5 text-xs rounded-full"
                          [class]="getPriorityClasses(task.priority)"
                        >
                          {{ task.priority | titlecase }}
                        </span>
                      </div>
                    }
                  </div>
                }

                <!-- Empty State -->
                @if (column.tasks.length === 0) {
                  <div class="p-4 text-center text-gray-500">
                    <p class="text-sm">No tasks yet</p>
                    <button
                      type="button"
                      class="mt-2 text-sm text-primary-600 hover:text-primary-700"
                      (click)="onAddTask(column)"
                    >
                      Add a task
                    </button>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Add Column Button -->
          @if (showAddColumn) {
            <div class="w-72 p-2">
              <button
                type="button"
                class="w-full p-3 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
                (click)="onAddColumn()"
              >
                <i class="fas fa-plus mr-2"></i>
                Add Column
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class KanbanComponent {
  @Input() title = 'Kanban Board';
  @Input() description = '';
  @Input() columns: KanbanColumn[] = [];
  @Input() showHeader = true;
  @Input() showAddColumn = true;

  @Output() columnAdd = new EventEmitter<void>();
  @Output() columnEdit = new EventEmitter<KanbanColumn>();
  @Output() taskAdd = new EventEmitter<KanbanColumn>();
  @Output() taskClick = new EventEmitter<KanbanTask>();
  @Output() taskMove = new EventEmitter<{
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
    newIndex: number;
  }>();

  onAddColumn(): void {
    this.columnAdd.emit();
  }

  onEditColumn(column: KanbanColumn): void {
    this.columnEdit.emit(column);
  }

  onAddTask(column: KanbanColumn): void {
    this.taskAdd.emit(column);
  }

  onTaskClick(task: KanbanTask): void {
    this.taskClick.emit(task);
  }

  getPriorityClasses(priority: string): string {
    const classes = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return classes[priority as keyof typeof classes];
  }

  // Helper method to get column by id
  getColumnById(columnId: string): KanbanColumn | undefined {
    return this.columns.find(column => column.id === columnId);
  }

  // Helper method to get task by id
  getTaskById(taskId: string): KanbanTask | undefined {
    for (const column of this.columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  }

  // Helper method to get column for task
  getColumnForTask(taskId: string): KanbanColumn | undefined {
    return this.columns.find(column => 
      column.tasks.some(task => task.id === taskId)
    );
  }

  // Helper method to move task between columns
  moveTask(taskId: string, fromColumnId: string, toColumnId: string, newIndex: number): void {
    const fromColumn = this.getColumnById(fromColumnId);
    const toColumn = this.getColumnById(toColumnId);
    
    if (!fromColumn || !toColumn) return;

    const taskIndex = fromColumn.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const [task] = fromColumn.tasks.splice(taskIndex, 1);
    toColumn.tasks.splice(newIndex, 0, task);

    this.taskMove.emit({ taskId, fromColumnId, toColumnId, newIndex });
  }

  // Helper method to get task count by column
  getTaskCount(columnId: string): number {
    const column = this.getColumnById(columnId);
    return column?.tasks.length || 0;
  }

  // Helper method to get tasks by tag
  getTasksByTag(tag: string): KanbanTask[] {
    const tasks: KanbanTask[] = [];
    this.columns.forEach(column => {
      tasks.push(...column.tasks.filter(task => 
        task.tags?.includes(tag)
      ));
    });
    return tasks;
  }

  // Helper method to get tasks by assignee
  getTasksByAssignee(assigneeId: string): KanbanTask[] {
    const tasks: KanbanTask[] = [];
    this.columns.forEach(column => {
      tasks.push(...column.tasks.filter(task => 
        task.assignee?.id === assigneeId
      ));
    });
    return tasks;
  }
}