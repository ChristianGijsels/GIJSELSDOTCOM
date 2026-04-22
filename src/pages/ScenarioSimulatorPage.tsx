import React, { useMemo, useState } from 'react';
import { HistoricalForecastLineChart, MethodComparisonChart } from '../components/charts';
import { mockForecastData } from '../data/mockForecastData';
import { applyScenario } from '../services/forecast';
import { ScenarioConfig } from '../types/forecast';

const baseSeries = mockForecastData[0].points;

export const ScenarioSimulatorPage: React.FC = () => {
  const [config, setConfig] = useState<ScenarioConfig>({
    demandGrowth: 5,
    seasonalityStrength: 20,
    noise: 4,
  });

  const adjusted = useMemo(() => applyScenario(baseSeries, config), [config]);

  const comparisonData = useMemo(
    () =>
      adjusted.map((point) => ({
        month: point.month,
        Baseline: point.historical,
        Scenario: point.forecast,
      })),
    [adjusted],
  );

  const onSlide = (key: keyof ScenarioConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main style={{ padding: 24, display: 'grid', gap: 18 }}>
      <h1>Scenario Simulator</h1>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px,1fr))', gap: 14 }}>
        <label>
          Demand Growth ({config.demandGrowth}%)
          <input type="range" min={-20} max={30} value={config.demandGrowth} onChange={onSlide('demandGrowth')} />
        </label>

        <label>
          Seasonality Strength ({config.seasonalityStrength}%)
          <input
            type="range"
            min={0}
            max={60}
            value={config.seasonalityStrength}
            onChange={onSlide('seasonalityStrength')}
          />
        </label>

        <label>
          Noise ({config.noise}%)
          <input type="range" min={0} max={20} value={config.noise} onChange={onSlide('noise')} />
        </label>
      </section>

      <HistoricalForecastLineChart data={adjusted} title="Historical vs Simulated Forecast" />
      <MethodComparisonChart data={comparisonData} methods={['Baseline', 'Scenario']} title="Scenario Comparison" />
    </main>
  );
};
