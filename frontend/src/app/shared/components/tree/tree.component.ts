import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  data?: any;
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-1">
      @for (node of nodes; track node.id) {
        <div>
          <!-- Node -->
          <div
            class="group flex items-center"
            [class]="getNodeClasses(node)"
            [class.pl-4]="level > 0"
            [class.cursor-pointer]="!node.disabled"
            (click)="onNodeClick(node)"
          >
            <!-- Expand/Collapse Icon -->
            @if (hasChildren(node)) {
              <button
                type="button"
                class="mr-1 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                [class.cursor-not-allowed]="node.disabled"
                (click)="onExpandClick($event, node)"
              >
                <i 
                  class="fas text-gray-400 transition-transform duration-200"
                  [class.fa-chevron-right]="!node.expanded"
                  [class.fa-chevron-down]="node.expanded"
                  [class.text-gray-300]="node.disabled"
                ></i>
              </button>
            } @else {
              <span class="w-7"></span>
            }

            <!-- Node Icon -->
            @if (node.icon) {
              <i 
                [class]="node.icon"
                class="mr-2 text-gray-400 group-hover:text-gray-500"
                [class.text-gray-300]="node.disabled"
              ></i>
            }

            <!-- Node Label -->
            <span 
              class="flex-1 truncate"
              [class.text-gray-400]="node.disabled"
            >
              {{ node.label }}
            </span>

            <!-- Loading Indicator -->
            @if (node.loading) {
              <div class="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-500"></div>
            }

            <!-- Actions -->
            @if (!node.disabled && showActions) {
              <div class="ml-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ng-content select="[treeNodeActions]"></ng-content>
              </div>
            }
          </div>

          <!-- Children -->
          @if (node.expanded && node.children?.length) {
            <div class="mt-1">
              <app-tree
                [nodes]="node.children"
                [level]="level + 1"
                [showActions]="showActions"
                [selectable]="selectable"
                [multiSelect]="multiSelect"
                (nodeClick)="onChildNodeClick($event)"
                (nodeExpand)="onChildNodeExpand($event)"
                (nodeSelect)="onChildNodeSelect($event)"
              ></app-tree>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class TreeComponent {
  @Input() nodes: TreeNode[] = [];
  @Input() level = 0;
  @Input() showActions = false;
  @Input() selectable = false;
  @Input() multiSelect = false;

  @Output() nodeClick = new EventEmitter<TreeNode>();
  @Output() nodeExpand = new EventEmitter<TreeNode>();
  @Output() nodeSelect = new EventEmitter<TreeNode[]>();

  getNodeClasses(node: TreeNode): string {
    return `
      py-1
      ${node.disabled ? 'cursor-not-allowed' : 'hover:bg-gray-50'}
      ${node.selected ? 'bg-primary-50' : ''}
    `.trim();
  }

  hasChildren(node: TreeNode): boolean {
    return !!node.children?.length;
  }

  onNodeClick(node: TreeNode): void {
    if (!node.disabled) {
      this.nodeClick.emit(node);
      if (this.selectable) {
        this.toggleNodeSelection(node);
      }
    }
  }

  onExpandClick(event: Event, node: TreeNode): void {
    event.stopPropagation();
    if (!node.disabled) {
      node.expanded = !node.expanded;
      this.nodeExpand.emit(node);
    }
  }

  onChildNodeClick(node: TreeNode): void {
    this.nodeClick.emit(node);
  }

  onChildNodeExpand(node: TreeNode): void {
    this.nodeExpand.emit(node);
  }

  onChildNodeSelect(nodes: TreeNode[]): void {
    this.nodeSelect.emit(nodes);
  }

  private toggleNodeSelection(node: TreeNode): void {
    if (!this.multiSelect) {
      // Single selection mode
      this.clearAllSelections();
      node.selected = true;
      this.nodeSelect.emit([node]);
    } else {
      // Multi selection mode
      node.selected = !node.selected;
      this.nodeSelect.emit(this.getSelectedNodes());
    }
  }

  private clearAllSelections(): void {
    const clearNodes = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        node.selected = false;
        if (node.children) {
          clearNodes(node.children);
        }
      });
    };
    clearNodes(this.nodes);
  }

  private getSelectedNodes(): TreeNode[] {
    const selected: TreeNode[] = [];
    const findSelected = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.selected) {
          selected.push(node);
        }
        if (node.children) {
          findSelected(node.children);
        }
      });
    };
    findSelected(this.nodes);
    return selected;
  }

  // Helper method to expand all nodes
  expandAll(): void {
    const expand = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (this.hasChildren(node)) {
          node.expanded = true;
          expand(node.children!);
        }
      });
    };
    expand(this.nodes);
  }

  // Helper method to collapse all nodes
  collapseAll(): void {
    const collapse = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (this.hasChildren(node)) {
          node.expanded = false;
          collapse(node.children!);
        }
      });
    };
    collapse(this.nodes);
  }

  // Helper method to find node by id
  findNode(id: string): TreeNode | undefined {
    const find = (nodes: TreeNode[]): TreeNode | undefined => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = find(node.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return find(this.nodes);
  }

  // Helper method to get node level
  getNodeLevel(node: TreeNode): number {
    let level = 0;
    const find = (nodes: TreeNode[], targetId: string, currentLevel: number): number => {
      for (const n of nodes) {
        if (n.id === targetId) return currentLevel;
        if (n.children) {
          const foundLevel = find(n.children, targetId, currentLevel + 1);
          if (foundLevel >= 0) return foundLevel;
        }
      }
      return -1;
    };
    return find(this.nodes, node.id, 0);
  }

  // Helper method to get parent node
  getParentNode(node: TreeNode): TreeNode | undefined {
    const find = (nodes: TreeNode[], parent?: TreeNode): TreeNode | undefined => {
      for (const n of nodes) {
        if (n.id === node.id) return parent;
        if (n.children) {
          const found = find(n.children, n);
          if (found) return found;
        }
      }
      return undefined;
    };
    return find(this.nodes);
  }

  // Helper method to get node path
  getNodePath(node: TreeNode): TreeNode[] {
    const path: TreeNode[] = [];
    const find = (nodes: TreeNode[], targetId: string, currentPath: TreeNode[]): boolean => {
      for (const n of nodes) {
        currentPath.push(n);
        if (n.id === targetId) return true;
        if (n.children && find(n.children, targetId, currentPath)) return true;
        currentPath.pop();
      }
      return false;
    };
    find(this.nodes, node.id, path);
    return path;
  }
}