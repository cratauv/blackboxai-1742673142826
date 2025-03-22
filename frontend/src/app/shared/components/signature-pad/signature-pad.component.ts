import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Point {
  x: number;
  y: number;
  time: number;
  pressure?: number;
}

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Canvas Container -->
      <div
        class="border rounded-lg overflow-hidden bg-white"
        [class.border-primary-500]="isDrawing"
      >
        <canvas
          #canvas
          [width]="width"
          [height]="height"
          class="touch-none"
          (mousedown)="onMouseDown($event)"
          (mousemove)="onMouseMove($event)"
          (mouseup)="onMouseUp()"
          (mouseleave)="onMouseLeave()"
          (touchstart)="onTouchStart($event)"
          (touchmove)="onTouchMove($event)"
          (touchend)="onTouchEnd()"
        ></canvas>
      </div>

      <!-- Controls -->
      <div class="mt-4 flex items-center justify-between">
        <!-- Color Picker -->
        @if (showControls) {
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm text-gray-700">Color:</label>
              <input
                type="color"
                [value]="penColor"
                (change)="onColorChange($event)"
                class="w-8 h-8 rounded cursor-pointer"
              />
            </div>

            <!-- Thickness Slider -->
            <div class="flex items-center space-x-2">
              <label class="text-sm text-gray-700">Thickness:</label>
              <input
                type="range"
                [value]="penWidth"
                (input)="onThicknessChange($event)"
                min="1"
                max="10"
                class="w-24"
              />
            </div>
          </div>
        }

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          @if (showClearButton) {
            <button
              type="button"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              (click)="clear()"
            >
              Clear
            </button>
          }
          @if (showUndoButton) {
            <button
              type="button"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              (click)="undo()"
              [disabled]="!canUndo"
            >
              Undo
            </button>
          }
          @if (showSaveButton) {
            <button
              type="button"
              class="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              (click)="save()"
              [disabled]="isEmpty"
            >
              Save
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class SignaturePadComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  @Input() width = 600;
  @Input() height = 200;
  @Input() penColor = '#000000';
  @Input() penWidth = 2;
  @Input() backgroundColor = '#ffffff';
  @Input() showControls = true;
  @Input() showClearButton = true;
  @Input() showUndoButton = true;
  @Input() showSaveButton = true;
  @Input() format: 'png' | 'jpeg' | 'svg' = 'png';
  @Input() quality = 1;

  @Output() begin = new EventEmitter<void>();
  @Output() end = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  private points: Point[] = [];
  private strokes: Point[][] = [];
  private isDrawing = false;
  private lastPoint?: Point;

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  private initCanvas(): void {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.clear();
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.startDrawing(event.offsetX, event.offsetY);
  }

  onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    if (this.isDrawing) {
      this.addPoint(event.offsetX, event.offsetY);
      this.draw();
    }
  }

  onMouseUp(): void {
    this.stopDrawing();
  }

  onMouseLeave(): void {
    this.stopDrawing();
  }

  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.startDrawing(
      touch.clientX - rect.left,
      touch.clientY - rect.top
    );
  }

  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (this.isDrawing) {
      const touch = event.touches[0];
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      this.addPoint(
        touch.clientX - rect.left,
        touch.clientY - rect.top,
        touch.force
      );
      this.draw();
    }
  }

  onTouchEnd(): void {
    this.stopDrawing();
  }

  private startDrawing(x: number, y: number): void {
    this.isDrawing = true;
    this.points = [];
    this.addPoint(x, y);
    this.begin.emit();
  }

  private addPoint(x: number, y: number, pressure = 1): void {
    const point: Point = { x, y, time: Date.now(), pressure };
    this.points.push(point);
    this.lastPoint = point;
  }

  private stopDrawing(): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.strokes.push([...this.points]);
      this.end.emit();
    }
  }

  private draw(): void {
    if (this.points.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i];
      const prevPoint = this.points[i - 1];
      
      // Calculate control points for smooth curve
      const c1x = prevPoint.x + (point.x - prevPoint.x) / 3;
      const c1y = prevPoint.y + (point.y - prevPoint.y) / 3;
      const c2x = point.x - (point.x - prevPoint.x) / 3;
      const c2y = point.y - (point.y - prevPoint.y) / 3;

      this.ctx.bezierCurveTo(c1x, c1y, c2x, c2y, point.x, point.y);
    }

    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.penWidth;
    this.ctx.stroke();
  }

  clear(): void {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.points = [];
    this.strokes = [];
    this.lastPoint = undefined;
  }

  undo(): void {
    if (this.strokes.length > 0) {
      this.strokes.pop();
      this.redraw();
    }
  }

  private redraw(): void {
    this.clear();
    this.strokes.forEach(stroke => {
      this.points = stroke;
      this.draw();
    });
  }

  save(): void {
    const dataUrl = this.canvas.nativeElement.toDataURL(
      `image/${this.format}`,
      this.quality
    );
    this.save.emit(dataUrl);
  }

  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.penColor = input.value;
  }

  onThicknessChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.penWidth = parseInt(input.value, 10);
  }

  // Helper method to check if signature is empty
  get isEmpty(): boolean {
    return this.strokes.length === 0;
  }

  // Helper method to check if undo is available
  get canUndo(): boolean {
    return this.strokes.length > 0;
  }

  // Helper method to get signature as SVG
  toSVG(): string {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.width.toString());
    svg.setAttribute('height', this.height.toString());
    svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);

    this.strokes.forEach(stroke => {
      if (stroke.length >= 2) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = `M ${stroke[0].x} ${stroke[0].y}`;

        for (let i = 1; i < stroke.length; i++) {
          const point = stroke[i];
          const prevPoint = stroke[i - 1];
          
          const c1x = prevPoint.x + (point.x - prevPoint.x) / 3;
          const c1y = prevPoint.y + (point.y - prevPoint.y) / 3;
          const c2x = point.x - (point.x - prevPoint.x) / 3;
          const c2y = point.y - (point.y - prevPoint.y) / 3;

          d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${point.x} ${point.y}`;
        }

        path.setAttribute('d', d);
        path.setAttribute('stroke', this.penColor);
        path.setAttribute('stroke-width', this.penWidth.toString());
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        svg.appendChild(path);
      }
    });

    return new XMLSerializer().serializeToString(svg);
  }

  // Helper method to set dimensions
  setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;
    this.redraw();
  }

  // Helper method to get points data
  getPoints(): Point[][] {
    return this.strokes;
  }

  // Helper method to load points data
  loadPoints(points: Point[][]): void {
    this.strokes = points;
    this.redraw();
  }

  // Helper method to get velocity at point
  private getVelocity(point: Point, prevPoint: Point): number {
    const timeDiff = point.time - prevPoint.time;
    if (timeDiff <= 0) return 0;

    const distance = Math.sqrt(
      Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
    );
    return distance / timeDiff;
  }
}