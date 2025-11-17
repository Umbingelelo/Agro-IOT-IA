import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CultivationZone } from '../../models/cultivation-center.model';
import { SparklineComponent } from '../sparkline/sparkline.component';

@Component({
  selector: 'app-sensor-card',
  templateUrl: './sensor-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SparklineComponent],
})
export class SensorCardComponent {
  zone = input.required<CultivationZone>();

  statusClasses = computed(() => {
    const status = this.zone().status();
    switch (status) {
      case 'Óptimo':
        return {
          'border': 'border-green-500/50',
          'text': 'text-green-400',
          'bg': 'bg-green-500',
          'icon-bg': 'bg-green-500/10',
          'sparkline': 'stroke-green-500'
        };
      case 'Alerta':
        return {
          'border': 'border-yellow-500/50',
          'text': 'text-yellow-400',
          'bg': 'bg-yellow-500',
          'icon-bg': 'bg-yellow-500/10',
          'sparkline': 'stroke-yellow-500'
        };
      case 'Crítico':
        return {
          'border': 'border-red-500/50',
          'text': 'text-red-400',
          'bg': 'bg-red-500',
          'icon-bg': 'bg-red-500/10',
          'sparkline': 'stroke-red-500'
        };
    }
  });

  humidityPercentageStyle = computed(() => {
    return { width: `${this.zone().soilHumidityPercent()}%` };
  });
}
