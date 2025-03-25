import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  limit?: number;
  cards: KanbanCard[];
}

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  labels?: KanbanLabel[];
  assignees?: KanbanAssignee[];
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
}

interface KanbanLabel {
  id: string;
  name: string;
  color: string;
}

interface KanbanAssignee {
  id: string;
  name: string;
  avatar?: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full overflow-x-auto">
      <div class="inline-flex h-full p-4 space-x-4">
        @for (column of columns; track column.id) {
          <div
            class="flex flex-col w-80 bg-gray-100 rounded-lg"
            [class.opacity-50]="isDraggingOver && dragOverColumn !== column.id"
          >
            <!-- Column Header -->
            <div
              class="p-3 font-medium text-gray-900 border-b border-gray-200"
              [style.borderLeftWidth]="4"
              [style.borderLeftColor]="column.color || '#9CA3AF'"
            >
              <div class="flex items-center justify-between">
                <span>{{ column.title }}</span>
                @if (column.limit) {
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    [class]="getColumnLimitClasses(column)"
                  >
                    {{ column.cards.length }}/{{ column.limit }}
                  </span>
                }
              </div>
            </div>

            <!-- Cards Container -->
            <div
              class="flex-1 p-2 space-y-2 overflow-y-auto"
              [attr.data-column-id]="column.id"
              (dragover)="onDragOver($event, column.id)"
              (drop)="onDrop($event, column.id)"
            >
              @for (card of column.cards; track card.id) {
                <div
                  class="bg-white rounded-lg shadow-sm"
                  [class.cursor-move]="!disabled"
                  [attr.draggable]="!disabled"
                  [attr.data-card-id]="card.id"
                  (dragstart)="onDragStart($event, card, column.id)"
                  (dragend)="onDragEnd()"
                  (click)="onCardClick(card)"
                >
                  <div class="p-3">
                    <!-- Labels -->
                    @if (card.labels?.length) {
                      <div class="flex flex-wrap gap-1 mb-2">
                        @for (label of card.labels; track label.id) {
                          <span
                            class="px-2 py-0.5 text-xs font-medium rounded-full"
                            [style.backgroundColor]="label.color + '33'"
                            [style.color]="label.color"
                          >
                            {{ label.name }}
                          </span>
                        }
                      </div>
                    }

                    <!-- Title -->
                    <h3 class="text-sm font-medium text-gray-900">
                      {{ card.title }}
                    </h3>

                    <!-- Description -->
                    @if (card.description) {
                      <p class="mt-1 text-sm text-gray-500 line-clamp-2">
                        {{ card.description }}
                      </p>
                    }

                    <!-- Footer -->
                    <div class="flex items-center justify-between mt-3">
                      <!-- Due Date -->
                      @if (card.dueDate) {
                        <span
                          class="flex items-center text-xs"
                          [class]="getDueDateClasses(card.dueDate)"
                        >
                          <i class="fas fa-clock mr-1"></i>
                          {{ formatDate(card.dueDate) }}
                        </span>
                      }

                      <!-- Priority -->
                      @if (card.priority) {
                        <span
                          class="flex items-center text-xs"
                          [class]="getPriorityClasses(card.priority)"
                        >
                          <i class="fas fa-flag mr-1"></i>
                          {{ card.priority }}
                        </span>
                      }

                      <!-- Assignees -->
                      @if (card.assignees?.length) {
                        <div class="flex -space-x-2">
                          @for (assignee of card.assignees; track assignee.id) {
                            @if (assignee.avatar) {
                              <img
                                [src]="assignee.avatar"
                                [alt]="assignee.name"
                                class="w-6 h-6 rounded-full ring-2 ring-white"
                                [title]="assignee.name"
                              >
                            } @else {
                              <div
                                class="w-6 h-6 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-600"
                                [title]="assignee.name"
                              >
                                {{ getInitials(assignee.name) }}
                              </div>
                            }
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }

              <!-- Empty Column State -->
              @if (column.cards.length === 0) {
                <div class="p-4 text-center text-sm text-gray-500">
                  No cards in this column
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
  @Input() columns: KanbanColumn[] = [];
  @Input() disabled = false;

  @Output() cardMove = new EventEmitter<{
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    newIndex: number;
  }>();
  @Output() cardClick = new EventEmitter<KanbanCard>();

  isDraggingOver = false;
  dragOverColumn: string | null = null;
  draggedCard: { card: KanbanCard; fromColumnId: string } | null = null;

  getColumnLimitClasses(column: KanbanColumn): string {
    if (!column.limit) return '';
    const count = column.cards.length;
    return count >= column.limit
      ? 'bg-error-100 text-error-700'
      : count >= column.limit * 0.8
      ? 'bg-warning-100 text-warning-700'
      : 'bg-gray-100 text-gray-700';
  }

  getDueDateClasses(date: Date): string {
    const now = new Date();
    const dueDate = new Date(date);
    const isOverdue = dueDate < now;
    const isToday = this.isSameDay(dueDate, now);
    
    return isOverdue
      ? 'text-error-600'
      : isToday
      ? 'text-warning-600'
      : 'text-gray-500';
  }

  getPriorityClasses(priority: string): string {
    return {
      high: 'text-error-600',
      medium: 'text-warning-600',
      low: 'text-success-600'
    }[priority] || 'text-gray-500';
  }

  formatDate(date: Date): string {
    const now = new Date();
    const dueDate = new Date(date);
    
    if (this.isSameDay(dueDate, now)) {
      return 'Today';
    }
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (this.isSameDay(dueDate, tomorrow)) {
      return 'Tomorrow';
    }
    
    return dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  onDragStart(event: DragEvent, card: KanbanCard, columnId: string): void {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    
    this.draggedCard = { card, fromColumnId: columnId };
    this.isDraggingOver = true;
    event.dataTransfer?.setData('text/plain', card.id);
  }

  onDragEnd(): void {
    this.isDraggingOver = false;
    this.dragOverColumn = null;
    this.draggedCard = null;
  }

  onDragOver(event: DragEvent, columnId: string): void {
    event.preventDefault();
    this.dragOverColumn = columnId;
  }

  onDrop(event: DragEvent, columnId: string): void {
    event.preventDefault();
    
    if (!this.draggedCard) return;
    
    const { card, fromColumnId } = this.draggedCard;
    if (fromColumnId === columnId) return;
    
    // Remove card from source column
    const fromColumn = this.columns.find(col => col.id === fromColumnId);
    if (fromColumn) {
      fromColumn.cards = fromColumn.cards.filter(c => c.id !== card.id);
    }
    
    // Add card to target column
    const toColumn = this.columns.find(col => col.id === columnId);
    if (toColumn) {
      // Check column limit
      if (toColumn.limit && toColumn.cards.length >= toColumn.limit) {
        return;
      }
      
      const dropIndex = toColumn.cards.length;
      toColumn.cards.push(card);
      
      this.cardMove.emit({
        cardId: card.id,
        fromColumnId,
        toColumnId: columnId,
        newIndex: dropIndex
      });
    }
  }

  onCardClick(card: KanbanCard): void {
    this.cardClick.emit(card);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  // Helper method to add column
  addColumn(column: KanbanColumn): void {
    this.columns.push({ ...column, cards: [] });
  }

  // Helper method to remove column
  removeColumn(columnId: string): void {
    this.columns = this.columns.filter(col => col.id !== columnId);
  }

  // Helper method to add card
  addCard(columnId: string, card: KanbanCard): void {
    const column = this.columns.find(col => col.id === columnId);
    if (column && (!column.limit || column.cards.length < column.limit)) {
      column.cards.push(card);
    }
  }

  // Helper method to remove card
  removeCard(cardId: string): void {
    this.columns.forEach(column => {
      column.cards = column.cards.filter(card => card.id !== cardId);
    });
  }

  // Helper method to update card
  updateCard(cardId: string, updates: Partial<KanbanCard>): void {
    this.columns.forEach(column => {
      const card = column.cards.find(c => c.id === cardId);
      if (card) {
        Object.assign(card, updates);
      }
    });
  }

  // Helper method to move card
  moveCard(cardId: string, toColumnId: string, toIndex?: number): void {
    let card: KanbanCard | undefined;
    let fromColumnId: string | undefined;

    // Find and remove card
    this.columns.forEach(column => {
      const index = column.cards.findIndex(c => c.id === cardId);
      if (index !== -1) {
        card = column.cards[index];
        fromColumnId = column.id;
        column.cards.splice(index, 1);
      }
    });

    // Add card to new column
    if (card && fromColumnId) {
      const toColumn = this.columns.find(col => col.id === toColumnId);
      if (toColumn) {
        if (toIndex === undefined) {
          toColumn.cards.push(card);
          toIndex = toColumn.cards.length - 1;
        } else {
          toColumn.cards.splice(toIndex, 0, card);
        }

        this.cardMove.emit({
          cardId,
          fromColumnId,
          toColumnId,
          newIndex: toIndex
        });
      }
    }
  }

  // Helper method to get column
  getColumn(columnId: string): KanbanColumn | undefined {
    return this.columns.find(col => col.id === columnId);
  }

  // Helper method to get card
  getCard(cardId: string): KanbanCard | undefined {
    for (const column of this.columns) {
      const card = column.cards.find(c => c.id === cardId);
      if (card) return card;
    }
    return undefined;
  }
}