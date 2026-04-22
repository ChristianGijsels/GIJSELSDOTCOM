import React from 'react';
import { KpiCard } from './KpiCard';

interface GrowthRateKpiProps {
  growthRate: number;
}

export const GrowthRateKpi: React.FC<GrowthRateKpiProps> = ({ growthRate }) => {
  const direction = growthRate >= 0 ? '↑' : '↓';
  return <KpiCard label="Growth Rate" value={`${direction} ${growthRate.toFixed(2)}%`} helperText="From first to last month" />;
};
