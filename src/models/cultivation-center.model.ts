import { WritableSignal } from '@angular/core';

export type HumidityStatus = 'Óptimo' | 'Alerta' | 'Crítico';

export interface CultivationZone {
  zoneId: string;
  cropType: string;
  soilHumidityPercent: WritableSignal<number>;
  ambientTemperatureC: WritableSignal<number>;
  isWatering: WritableSignal<boolean>;
  valveStatus: WritableSignal<'open' | 'closed'>;
  humidityHistory: WritableSignal<number[]>;
  status: WritableSignal<HumidityStatus>;
}

// Interface for the raw API response data
export interface ApiCultivationZone {
  zoneId: string;
  cropType: string;
  soilHumidityPercent: number;
  ambientTemperatureC: number;
  isWatering: boolean;
  valveStatus: 'open' | 'closed';
  humidityHistory: number[];
}
