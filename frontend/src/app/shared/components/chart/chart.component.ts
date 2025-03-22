import { Component, Input, ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
};

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full">
      <!-- Chart Container -->
      <div [class.opacity-50]="loading">
        <canvas #chartCanvas></canvas>
      </div>

      <!-- Loading Overlay -->
      @if (loading) {
        <div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            <span class="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      }

      <!-- No Data Message -->
      @if (!loading && (!data || data.datasets[0].data.length === 0)) {
        <div class="absolute inset-0 flex items-center justify-center">
          <p class="text-gray-500">No data available</p>
        </div>
      }
    </div>
  `
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() type: ChartType = 'line';
  @Input() data: ChartData = { labels: [], datasets: [{ label: '', data: [] }] };
  @Input() options?: ChartConfiguration['options'];
  @Input() width = '100%';
  @Input() height = '400px';
  @Input() loading = false;
  @Input() responsive = true;
  @Input() maintainAspectRatio = true;

  private chart?: Chart;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['data'] || changes['options']) && this.chart) {
      this.updateChart();
    }
    if (changes['type'] && this.chart) {
      this.destroyChart();
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private createChart(): void {
    const canvas = this.elementRef.nativeElement.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const defaultOptions: ChartConfiguration['options'] = {
      responsive: this.responsive,
      maintainAspectRatio: this.maintainAspectRatio,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          cornerRadius: 4,
          displayColors: true
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    };

    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: { ...defaultOptions, ...this.options }
    });
  }

  private updateChart(): void {
    if (!this.chart) return;

    this.chart.data = this.data;
    if (this.options) {
      this.chart.options = { ...this.chart.options, ...this.options };
    }
    this.chart.update();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  // Helper method to update dataset colors
  updateColors(colors: string[]): void {
    if (!this.chart) return;

    this.chart.data.datasets.forEach((dataset, index) => {
      dataset.backgroundColor = colors[index % colors.length];
      dataset.borderColor = colors[index % colors.length];
    });
    this.chart.update();
  }

  // Helper method to toggle dataset visibility
  toggleDataset(index: number): void {
    if (!this.chart) return;

    const meta = this.chart.getDatasetMeta(index);
    meta.hidden = !meta.hidden;
    this.chart.update();
  }

  // Helper method to update chart size
  updateSize(width: string, height: string): void {
    const canvas = this.elementRef.nativeElement.querySelector('canvas');
    if (!canvas) return;

    canvas.style.width = width;
    canvas.style.height = height;
    if (this.chart) {
      this.chart.resize();
    }
  }

  // Helper method to get dataset value at index
  getValueAtIndex(datasetIndex: number, index: number): number | null {
    if (!this.chart) return null;

    const dataset = this.chart.data.datasets[datasetIndex];
    return dataset ? dataset.data[index] : null;
  }

  // Helper method to get chart data as CSV
  getDataAsCSV(): string {
    if (!this.chart) return '';

    const headers = ['Label', ...this.chart.data.datasets.map(d => d.label)];
    const rows = this.chart.data.labels?.map((label, i) => {
      const values = this.chart.data.datasets.map(d => d.data[i]);
      return [label, ...values];
    });

    return [
      headers.join(','),
      ...(rows?.map(row => row.join(',')) || [])
    ].join('\n');
  }

  // Helper method to download chart as image
  downloadImage(fileName: string = 'chart.png'): void {
    if (!this.chart) return;

    const link = document.createElement('a');
    link.download = fileName;
    link.href = this.chart.toBase64Image();
    link.click();
  }
}