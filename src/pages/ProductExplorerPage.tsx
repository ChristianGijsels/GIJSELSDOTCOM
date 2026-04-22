import React, { useMemo, useState } from 'react';
import { HistoricalForecastLineChart } from '../components/charts';
import { mockForecastData } from '../data/mockForecastData';
import { ProductForecast, Region } from '../types/forecast';

const allRegions: Array<'All' | Region> = ['All', 'North America', 'Europe', 'Asia Pacific', 'Latin America'];

export const ProductExplorerPage: React.FC = () => {
  const [productId, setProductId] = useState<string>('P-100');
  const [region, setRegion] = useState<'All' | Region>('All');

  const productOptions = useMemo(
    () => [...new Set(mockForecastData.map((item) => item.productId))],
    [],
  );

  const selectedSeries: ProductForecast[] = useMemo(
    () =>
      mockForecastData.filter(
        (item) => item.productId === productId && (region === 'All' || item.region === region),
      ),
    [productId, region],
  );

  const mergedPoints = useMemo(() => {
    const monthMap = new Map<string, { month: string; historical: number; forecast: number }>();

    selectedSeries.forEach((series) => {
      series.points.forEach((point) => {
        const existing = monthMap.get(point.month) ?? { month: point.month, historical: 0, forecast: 0 };
        existing.historical += point.historical;
        existing.forecast += point.forecast;
        monthMap.set(point.month, existing);
      });
    });

    return [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month));
  }, [selectedSeries]);

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <h1>Product Explorer</h1>

      <section style={{ display: 'flex', gap: 12 }}>
        <label>
          Product:{' '}
          <select value={productId} onChange={(e) => setProductId(e.target.value)}>
            {productOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Region:{' '}
          <select value={region} onChange={(e) => setRegion(e.target.value as 'All' | Region)}>
            {allRegions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </section>

      <HistoricalForecastLineChart data={mergedPoints} title="Historical vs Forecast by Product" />

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Month</th>
            <th>Historical</th>
            <th>Forecast</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          {mergedPoints.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{row.historical.toLocaleString()}</td>
              <td>{row.forecast.toLocaleString()}</td>
              <td>{Math.abs(row.historical - row.forecast).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};
