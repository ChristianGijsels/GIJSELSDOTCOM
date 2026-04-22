export type Region = 'North America' | 'Europe' | 'Asia Pacific' | 'Latin America';

export type ForecastMethod = 'Linear Trend' | 'Seasonal Naive' | 'Moving Average';

export interface ForecastPoint {
  month: string;
  historical: number;
  forecast: number;
  method?: ForecastMethod;
}

export interface ProductForecast {
  productId: string;
  productName: string;
  region: Region;
  points: ForecastPoint[];
}

export interface DashboardFilters {
  region?: Region | 'All';
  productIds?: string[];
}

export interface AlertItem {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  month: string;
}

export interface ScenarioConfig {
  demandGrowth: number;
  seasonalityStrength: number;
  noise: number;
}
