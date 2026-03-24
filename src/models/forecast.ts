export interface Product {
  id: string;
  name: string;
  baseLevel: number;
  trendSlope: number;
  seasonalityAmplitude: number;
}

export interface Region {
  id: string;
  name: string;
  multiplier: number;
}

export interface MonthlyPoint {
  month: string;
  date: Date;
  value: number;
}

export interface SeriesKey {
  productId: string;
  regionId: string;
}

export interface ProductRegionSeries {
  key: SeriesKey;
  product: Product;
  region: Region;
  points: MonthlyPoint[];
}
