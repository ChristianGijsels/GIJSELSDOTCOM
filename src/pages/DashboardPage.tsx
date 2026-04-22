import React, { useMemo, useState } from 'react';
import { HistoricalForecastLineChart } from '../components/charts';
import { ForecastErrorKpi, ForecastNextMonthKpi, GrowthRateKpi, TotalSalesKpi } from '../components/kpi';
import { mockForecastData } from '../data/mockForecastData';
import { buildAlerts } from '../services/alerts';
import { aggregateByFilters, computeForecastErrorRate } from '../services/forecast';
import { Region } from '../types/forecast';

const regions: Array<'All' | Region> = ['All', 'North America', 'Europe', 'Asia Pacific', 'Latin America'];

export const DashboardPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<'All' | Region>('All');

  const aggregated = useMemo(
    () => aggregateByFilters(mockForecastData, { region: selectedRegion }),
    [selectedRegion],
  );

  const totalSales = aggregated.reduce((sum, p) => sum + p.historical, 0);
  const nextMonth = aggregated[aggregated.length - 1];
  const errorRate = computeForecastErrorRate(aggregated.map((p) => ({ actual: p.actual, forecast: p.forecast })));
  const growthRate = aggregated.length
    ? ((aggregated[aggregated.length - 1].historical - aggregated[0].historical) / aggregated[0].historical) * 100
    : 0;

  const alerts = useMemo(() => buildAlerts(aggregated), [aggregated]);

  return (
    <main style={{ padding: 24, display: 'grid', gap: 20 }}>
      <header>
        <h1>Forecast Dashboard</h1>
        <label>
          Region:{' '}
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value as 'All' | Region)}>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: 16 }}>
        <TotalSalesKpi totalSales={totalSales} />
        <ForecastNextMonthKpi month={nextMonth?.month ?? 'N/A'} value={nextMonth?.forecast ?? 0} />
        <ForecastErrorKpi errorRate={errorRate} />
        <GrowthRateKpi growthRate={growthRate} />
      </section>

      <HistoricalForecastLineChart data={aggregated} title="Historical vs Forecast (Aggregated)" />

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <h3>Alerts</h3>
        {alerts.length === 0 ? (
          <p>No alerts for selected filter.</p>
        ) : (
          <ul>
            {alerts.map((alert) => (
              <li key={alert.id}>
                <strong>[{alert.severity.toUpperCase()}]</strong> {alert.title} - {alert.message}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
