import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

type ColorFormat = 'hex' | 'rgb' | 'hsl';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-64 bg-white rounded-lg shadow-lg">
      <!-- Color Preview -->
      <div class="p-4 border-b">
        <div 
          class="h-12 rounded-lg shadow-inner"
          [style.backgroundColor]="color"
        ></div>
      </div>

      <!-- Color Selection Area -->
      <div class="p-4">
        <!-- Hue Slider -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Hue
          </label>
          <div class="relative h-4 rounded-lg overflow-hidden">
            <div
              class="absolute inset-0"
              [style.background]="getHueGradient()"
            ></div>
            <input
              type="range"
              min="0"
              max="360"
              [ngModel]="hsl.h"
              (ngModelChange)="onHueChange($event)"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <!-- Saturation & Lightness Grid -->
        <div class="relative mb-4">
          <div
            class="h-32 rounded-lg overflow-hidden cursor-pointer"
            (mousedown)="startSLDrag($event)"
            (mousemove)="onSLDrag($event)"
            (mouseup)="stopSLDrag()"
            (mouseleave)="stopSLDrag()"
            #slPicker
          >
            <!-- Saturation Gradient -->
            <div
              class="absolute inset-0"
              [style.backgroundColor]="getHueColor()"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
            </div>

            <!-- Selection Marker -->
            <div
              class="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-lg pointer-events-none"
              [style.left]="getSLMarkerLeft()"
              [style.top]="getSLMarkerTop()"
            ></div>
          </div>
        </div>

        <!-- Color Format Selector -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <div class="flex rounded-md shadow-sm">
            @for (format of ['hex', 'rgb', 'hsl']; track format) {
              <button
                type="button"
                class="flex-1 px-4 py-2 text-sm font-medium border first:rounded-l-md last:rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10"
                [class]="getFormatButtonClasses(format)"
                (click)="setFormat(format as ColorFormat)"
              >
                {{ format.toUpperCase() }}
              </button>
            }
          </div>
        </div>

        <!-- Color Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Color Value
          </label>
          @switch (format) {
            @case ('hex') {
              <input
                type="text"
                [ngModel]="getHexColor()"
                (ngModelChange)="onHexInput($event)"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="#000000"
                maxlength="7"
              />
            }
            @case ('rgb') {
              <div class="grid grid-cols-3 gap-2">
                @for (component of ['r', 'g', 'b']; track component) {
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">
                      {{ component.toUpperCase() }}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      [ngModel]="rgb[component]"
                      (ngModelChange)="onRGBInput(component, $event)"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                }
              </div>
            }
            @case ('hsl') {
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">H</label>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    [ngModel]="hsl.h"
                    (ngModelChange)="onHSLInput('h', $event)"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                @for (component of ['s', 'l']; track component) {
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">
                      {{ component.toUpperCase() }}%
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      [ngModel]="hsl[component]"
                      (ngModelChange)="onHSLInput(component, $event)"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                }
              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class ColorPickerComponent {
  @Input() color = '#000000';
  @Input() format: ColorFormat = 'hex';

  @Output() colorChange = new EventEmitter<string>();
  @Output() formatChange = new EventEmitter<ColorFormat>();

  rgb: RGB = { r: 0, g: 0, b: 0 };
  hsl: HSL = { h: 0, s: 0, l: 0 };
  isDragging = false;

  ngOnInit(): void {
    this.updateFromHex(this.color);
  }

  ngOnChanges(): void {
    this.updateFromHex(this.color);
  }

  private updateFromHex(hex: string): void {
    this.rgb = this.hexToRGB(hex);
    this.hsl = this.rgbToHSL(this.rgb);
  }

  onHueChange(hue: number): void {
    this.hsl.h = hue;
    this.updateColor();
  }

  startSLDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.handleSLDrag(event);
  }

  onSLDrag(event: MouseEvent): void {
    if (this.isDragging) {
      this.handleSLDrag(event);
    }
  }

  stopSLDrag(): void {
    this.isDragging = false;
  }

  private handleSLDrag(event: MouseEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));

    this.hsl.s = x * 100;
    this.hsl.l = (1 - y) * 100;
    this.updateColor();
  }

  setFormat(format: ColorFormat): void {
    this.format = format;
    this.formatChange.emit(format);
  }

  onHexInput(hex: string): void {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      this.updateFromHex(hex);
      this.emitColor();
    }
  }

  onRGBInput(component: string, value: number): void {
    this.rgb[component as keyof RGB] = Math.max(0, Math.min(255, value));
    this.hsl = this.rgbToHSL(this.rgb);
    this.emitColor();
  }

  onHSLInput(component: string, value: number): void {
    const max = component === 'h' ? 360 : 100;
    this.hsl[component as keyof HSL] = Math.max(0, Math.min(max, value));
    this.updateColor();
  }

  private updateColor(): void {
    this.rgb = this.hslToRGB(this.hsl);
    this.emitColor();
  }

  private emitColor(): void {
    const color = this.format === 'hex' ? this.getHexColor() :
                 this.format === 'rgb' ? this.getRGBColor() :
                 this.getHSLColor();
    this.colorChange.emit(color);
  }

  getHexColor(): string {
    return this.rgbToHex(this.rgb);
  }

  getRGBColor(): string {
    return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
  }

  getHSLColor(): string {
    return `hsl(${Math.round(this.hsl.h)}, ${Math.round(this.hsl.s)}%, ${Math.round(this.hsl.l)}%)`;
  }

  getHueGradient(): string {
    const stops = Array.from({ length: 7 }, (_, i) => {
      const hue = i * 60;
      return `hsl(${hue}, 100%, 50%) ${(i / 6) * 100}%`;
    });
    return `linear-gradient(to right, ${stops.join(', ')})`;
  }

  getHueColor(): string {
    return `hsl(${this.hsl.h}, 100%, 50%)`;
  }

  getSLMarkerLeft(): string {
    return `${this.hsl.s}%`;
  }

  getSLMarkerTop(): string {
    return `${100 - this.hsl.l}%`;
  }

  getFormatButtonClasses(buttonFormat: string): string {
    return buttonFormat === this.format
      ? 'bg-primary-50 text-primary-600 border-primary-600 z-10'
      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  }

  // Color conversion helpers
  private hexToRGB(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToHex(rgb: RGB): string {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  private rgbToHSL(rgb: RGB): HSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h *= 60;
    }

    return { h, s: s * 100, l: l * 100 };
  }

  private hslToRGB(hsl: HSL): RGB {
    const h = hsl.h;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, (h / 360 + 1/3));
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, (h / 360 - 1/3));
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
}