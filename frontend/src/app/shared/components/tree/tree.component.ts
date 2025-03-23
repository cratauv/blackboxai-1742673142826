import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TreeNode {
  id: string | number;
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
            class="flex items-center py-1 px-2 rounded-md"
            [class]="getNodeClasses(node)"
            [class.cursor-pointer]="!node.disabled"
            (click)="onNodeClick($event, node)"
          >
            <!-- Expand/Collapse Icon -->
            @if (hasChildren(node)) {
              <button
                type="button"
                class="w-4 h-4 flex items-center justify-center mr-1 text-gray-400 hover:text-gray-600"
                [class.opacity-50]="node.disabled"
                (click)="onExpandClick($event, node)"
              >
                <i
                  class="fas"
                  [class.fa-chevron-right]="!node.expanded"
                  [class.fa-chevron-down]="node.expanded"
                ></i>
              </button>
            } @else {
              <div class="w-4 mr-1"></div>
            }

            <!-- Loading Indicator -->
            @if (node.loading) {
              <div class="w-4 h-4 mr-2">
                <div class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }

            <!-- Node Icon -->
            @if (node.icon) {
              <i [class]="node.icon" class="mr-2 text-gray-400"></i>
            }

            <!-- Node Label -->
            <span class="truncate">{{ node.label }}</span>

            <!-- Custom Actions -->
            @if (showActions && !node.disabled) {
              <div class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ng-container
                  [ngTemplateOutlet]="actionTemplate"
                  [ngTemplateOutletContext]="{ $implicit: node }"
                ></ng-container>
              </div>
            }
          </div>

          <!-- Children -->
          @if (node.expanded && node.children?.length) {
            <div class="ml-6 mt-1">
              <app-tree
                [nodes]="node.children"
                [selectable]="selectable"
                [multiSelect]="multiSelect"
                [showActions]="showActions"
                [actionTemplate]="actionTemplate"
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
  @Input() selectable = false;
  @Input() multiSelect = false;
  @Input() showActions = false;
  @Input() actionTemplate: any;

  @Output() nodeClick = new EventEmitter<TreeNode>();
  @Output() nodeExpand = new EventEmitter<TreeNode>();
  @Output() nodeSelect = new EventEmitter<TreeNode>();

  getNodeClasses(node: TreeNode): string {
    return `
      group
      ${node.disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${node.selected ? 'bg-primary-50 text-primary-900' : 'hover:bg-gray-50'}
      ${this.selectable && !node.disabled ? 'cursor-pointer' : ''}
    `;
  }

  hasChildren(node: TreeNode): boolean {
    return !!node.children?.length;
  }

  onNodeClick(event: MouseEvent, node: TreeNode): void {
    if (node.disabled) return;

    if (this.selectable) {
      this.toggleNodeSelection(node);
    }
    this.nodeClick.emit(node);
  }

  onExpandClick(event: MouseEvent, node: TreeNode): void {
    event.stopPropagation();
    if (node.disabled) return;

    node.expanded = !node.expanded;
    this.nodeExpand.emit(node);
  }

  onChildNodeClick(node: TreeNode): void {
    this.nodeClick.emit(node);
  }

  onChildNodeExpand(node: TreeNode): void {
    this.nodeExpand.emit(node);
  }

  onChildNodeSelect(node: TreeNode): void {
    this.nodeSelect.emit(node);
  }

  private toggleNodeSelection(node: TreeNode): void {
    if (!this.multiSelect) {
      this.clearSelection(this.nodes);
    }
    node.selected = !node.selected;
    this.nodeSelect.emit(node);
  }

  private clearSelection(nodes: TreeNode[]): void {
    nodes.forEach(node => {
      node.selected = false;
      if (node.children?.length) {
        this.clearSelection(node.children);
      }
    });
  }

  // Helper method to expand node
  expandNode(nodeId: string | number): void {
    this.findAndUpdateNode(this.nodes, nodeId, node => {
      node.expanded = true;
      this.nodeExpand.emit(node);
    });
  }

  // Helper method to collapse node
  collapseNode(nodeId: string | number): void {
    this.findAndUpdateNode(this.nodes, nodeId, node => {
      node.expanded = false;
      this.nodeExpand.emit(node);
    });
  }

  // Helper method to select node
  selectNode(nodeId: string | number): void {
    if (!this.selectable) return;

    this.findAndUpdateNode(this.nodes, nodeId, node => {
      if (!this.multiSelect) {
        this.clearSelection(this.nodes);
      }
      node.selected = true;
      this.nodeSelect.emit(node);
    });
  }

  // Helper method to deselect node
  deselectNode(nodeId: string | number): void {
    this.findAndUpdateNode(this.nodes, nodeId, node => {
      node.selected = false;
      this.nodeSelect.emit(node);
    });
  }

  // Helper method to expand all nodes
  expandAll(): void {
    this.updateAllNodes(this.nodes, node => {
      if (this.hasChildren(node)) {
        node.expanded = true;
        this.nodeExpand.emit(node);
      }
    });
  }

  // Helper method to collapse all nodes
  collapseAll(): void {
    this.updateAllNodes(this.nodes, node => {
      node.expanded = false;
      this.nodeExpand.emit(node);
    });
  }

  // Helper method to get selected nodes
  getSelectedNodes(): TreeNode[] {
    const selected: TreeNode[] = [];
    this.traverseNodes(this.nodes, node => {
      if (node.selected) {
        selected.push(node);
      }
    });
    return selected;
  }

  // Helper method to find node by id
  findNode(nodeId: string | number): TreeNode | undefined {
    let found: TreeNode | undefined;
    this.traverseNodes(this.nodes, node => {
      if (node.id === nodeId) {
        found = node;
      }
    });
    return found;
  }

  // Helper method to traverse nodes
  private traverseNodes(nodes: TreeNode[], callback: (node: TreeNode) => void): void {
    nodes.forEach(node => {
      callback(node);
      if (node.children?.length) {
        this.traverseNodes(node.children, callback);
      }
    });
  }

  // Helper method to find and update node
  private findAndUpdateNode(
    nodes: TreeNode[],
    nodeId: string | number,
    callback: (node: TreeNode) => void
  ): void {
    nodes.forEach(node => {
      if (node.id === nodeId) {
        callback(node);
      } else if (node.children?.length) {
        this.findAndUpdateNode(node.children, nodeId, callback);
      }
    });
  }

  // Helper method to update all nodes
  private updateAllNodes(nodes: TreeNode[], callback: (node: TreeNode) => void): void {
    nodes.forEach(node => {
      callback(node);
      if (node.children?.length) {
        this.updateAllNodes(node.children, callback);
      }
    });
  }
}