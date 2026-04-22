import { AlertItem } from '../types/forecast';

interface AlertInputPoint {
  month: string;
  historical: number;
  forecast: number;
}

interface AlertConfig {
  deltaThresholdPct?: number;
  errorThresholdPct?: number;
}

export const buildAlerts = (
  points: AlertInputPoint[],
  config: AlertConfig = {},
): AlertItem[] => {
  const deltaThresholdPct = config.deltaThresholdPct ?? 25;
  const errorThresholdPct = config.errorThresholdPct ?? 12;

  const alerts: AlertItem[] = [];

  for (let i = 1; i < points.length; i += 1) {
    const current = points[i];
    const prev = points[i - 1];

    if (prev.historical !== 0) {
      const deltaPct = ((current.historical - prev.historical) / prev.historical) * 100;
      if (Math.abs(deltaPct) >= deltaThresholdPct) {
        alerts.push({
          id: `${current.month}-delta`,
          severity: Math.abs(deltaPct) >= deltaThresholdPct * 1.5 ? 'critical' : 'warning',
          title: deltaPct > 0 ? 'Sudden sales spike' : 'Sudden sales drop',
          message: `Month-over-month change reached ${deltaPct.toFixed(1)}% (threshold ${deltaThresholdPct}%).`,
          month: current.month,
        });
      }
    }

    if (current.historical !== 0) {
      const errorPct = (Math.abs(current.historical - current.forecast) / current.historical) * 100;
      if (errorPct >= errorThresholdPct) {
        alerts.push({
          id: `${current.month}-error`,
          severity: errorPct >= errorThresholdPct * 1.5 ? 'critical' : 'warning',
          title: 'Forecast error threshold exceeded',
          message: `Forecast error for ${current.month} is ${errorPct.toFixed(1)}% (threshold ${errorThresholdPct}%).`,
          month: current.month,
        });
      }
    }
  }

  return alerts;
};
