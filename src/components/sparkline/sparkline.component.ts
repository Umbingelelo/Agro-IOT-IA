import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-sparkline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg 
      [attr.viewBox]="'0 0 ' + width + ' ' + height" 
      class="w-full h-16"
      preserveAspectRatio="none">
      <path 
        [attr.d]="pathD()"
        fill="none" 
        [class]="strokeClass()"
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
    </svg>
  `
})
export class SparklineComponent {
  data = input.required<number[]>();
  strokeClass = input<string>('stroke-cyan-500');

  readonly width = 120;
  readonly height = 40;
  
  pathD = computed(() => {
    const dataPoints = this.data();
    if (!dataPoints || dataPoints.length < 2) {
      return 'M 0,20 L 120,20'; // Return a flat line if not enough data
    }
    
    const strokeWidth = 2;
    const innerHeight = this.height - strokeWidth * 2;
    
    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
    const range = (max - min) === 0 ? 1 : (max - min);

    const points = dataPoints.map((d, i) => {
      const x = (i / (dataPoints.length - 1)) * this.width;
      const y = (innerHeight - ((d - min) / range) * innerHeight) + strokeWidth;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    return `M ${points.join(' L ')}`;
  });
}
