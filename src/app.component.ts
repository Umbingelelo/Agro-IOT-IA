import { Component, OnInit, OnDestroy, signal, computed, ChangeDetectionStrategy, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorCardComponent } from './components/sensor-card/sensor-card.component';
import { CultivationZone, HumidityStatus, ApiCultivationZone } from './models/cultivation-center.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SensorCardComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  private updateInterval: any;
  
  private baseZones = [
    { zoneId: 'zone-tmt01', cropType: 'Tomates' },
    { zoneId: 'zone-miz02', cropType: 'Maíz' },
    { zoneId: 'zone-plt03', cropType: 'Paltas' },
    { zoneId: 'zone-uva04', cropType: 'Uvas' },
    { zoneId: 'zone-arn05', cropType: 'Arándanos' },
    { zoneId: 'zone-trg06', cropType: 'Trigo' },
  ];

  zones: WritableSignal<CultivationZone[]> = signal([]);

  totalZones = computed(() => this.zones().length);
  optimalZones = computed(() => this.zones().filter(c => c.status() === 'Óptimo').length);
  alertZones = computed(() => this.zones().filter(c => c.status() === 'Alerta').length);
  criticalZones = computed(() => this.zones().filter(c => c.status() === 'Crítico').length);
  
  averageHumidity = computed(() => {
    const allZones = this.zones();
    if (allZones.length === 0) return 0;
    const sum = allZones.reduce((acc, zone) => acc + zone.soilHumidityPercent(), 0);
    return Math.round(sum / allZones.length);
  });
  
  averageTemperature = computed(() => {
    const allZones = this.zones();
    if (allZones.length === 0) return 0;
    const sum = allZones.reduce((acc, zone) => acc + zone.ambientTemperatureC(), 0);
    return (sum / allZones.length).toFixed(1);
  });
  
  lastUpdated = signal<Date | null>(null);

  ngOnInit(): void {
    this.updateSimulatedData();
    this.updateInterval = setInterval(() => this.updateSimulatedData(), 5000);
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private updateSimulatedData(): void {
    const apiZones = this.generateRandomData();
    this.zones.update(currentZones => {
      return apiZones.map(apiZone => {
        const existingZone = currentZones.find(z => z.zoneId === apiZone.zoneId);
        const humidityStatus = this.getHumidityStatus(apiZone.soilHumidityPercent);

        if (existingZone) {
          // Update existing signals to be more efficient
          existingZone.soilHumidityPercent.set(apiZone.soilHumidityPercent);
          existingZone.ambientTemperatureC.set(apiZone.ambientTemperatureC);
          existingZone.isWatering.set(apiZone.isWatering);
          existingZone.valveStatus.set(apiZone.valveStatus);
          existingZone.humidityHistory.set(apiZone.humidityHistory);
          existingZone.status.set(humidityStatus);
          return existingZone;
        } else {
          // Create a new zone object with signals
          return {
            zoneId: apiZone.zoneId,
            cropType: apiZone.cropType,
            soilHumidityPercent: signal(apiZone.soilHumidityPercent),
            ambientTemperatureC: signal(apiZone.ambientTemperatureC),
            isWatering: signal(apiZone.isWatering),
            valveStatus: signal(apiZone.valveStatus),
            humidityHistory: signal(apiZone.humidityHistory),
            status: signal(humidityStatus),
          };
        }
      });
    });
    this.lastUpdated.set(new Date());
  }
  
  private generateRandomData(): ApiCultivationZone[] {
    return this.baseZones.map(baseZone => {
      const soilHumidityPercent = parseFloat((Math.random() * 60 + 30).toFixed(1)); // 30% to 90%
      const ambientTemperatureC = parseFloat((Math.random() * 15 + 15).toFixed(1)); // 15°C to 30°C
      const isWatering = Math.random() > 0.8; // 20% chance of watering
      const valveStatus = isWatering ? 'open' : 'closed';
      
      const history = Array.from({ length: 6 }, () => 
        parseFloat((soilHumidityPercent + (Math.random() * 10 - 5)).toFixed(1))
      );
      history.push(soilHumidityPercent);

      return {
        ...baseZone,
        soilHumidityPercent,
        ambientTemperatureC,
        isWatering,
        valveStatus,
        humidityHistory: history,
      };
    });
  }

  private getHumidityStatus(humidity: number): HumidityStatus {
    if (humidity < 40 || humidity > 85) {
      return 'Crítico';
    }
    if (humidity < 55 || humidity > 75) {
      return 'Alerta';
    }
    return 'Óptimo';
  }
}