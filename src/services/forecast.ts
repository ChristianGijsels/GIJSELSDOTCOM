import { DashboardFilters, ForecastPoint, ProductForecast, ScenarioConfig } from '../types/forecast';

export interface AggregatedPoint extends ForecastPoint {
  actual: number;
  absError: number;
}

export const aggregateByFilters = (
  dataset: ProductForecast[],
  filters: DashboardFilters,
): AggregatedPoint[] => {
  const filtered = dataset.filter((item) => {
    const regionMatch = !filters.region || filters.region === 'All' || item.region === filters.region;
    const productMatch = !filters.productIds?.length || filters.productIds.includes(item.productId);
    return regionMatch && productMatch;
  });

  const monthMap = new Map<string, AggregatedPoint>();

  for (const item of filtered) {
    for (const point of item.points) {
      const current = monthMap.get(point.month) ?? {
        month: point.month,
        historical: 0,
        forecast: 0,
        actual: 0,
        absError: 0,
      };
      current.historical += point.historical;
      current.forecast += point.forecast;
      monthMap.set(point.month, current);
    }
  }

  return [...monthMap.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((point) => ({
      ...point,
      actual: point.historical,
      absError: Math.abs(point.historical - point.forecast),
    }));
};

export const computeForecastErrorRate = (points: Array<{ actual: number; forecast: number }>) => {
  if (!points.length) return 0;

  const weightedApe = points.reduce((acc, point) => {
    if (point.actual === 0) return acc;
    return acc + Math.abs(point.actual - point.forecast) / point.actual;
  }, 0);

  return (weightedApe / points.length) * 100;
};

export const applyScenario = (
  points: ForecastPoint[],
  config: ScenarioConfig,
): ForecastPoint[] => {
  return points.map((point, index) => {
    const trendMultiplier = 1 + config.demandGrowth / 100;
    const seasonalWave = Math.sin((index / 12) * Math.PI * 2) * (config.seasonalityStrength / 100);
    const noiseOffset = ((index % 5) - 2) * (config.noise / 100);

    const nextForecast = Math.max(0, Math.round(point.forecast * trendMultiplier * (1 + seasonalWave + noiseOffset)));

    return {
      ...point,
      forecast: nextForecast,
    };
  });
};
