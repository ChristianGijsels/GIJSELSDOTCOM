import React from 'react';
import { KpiCard } from './KpiCard';

interface ForecastNextMonthKpiProps {
  month: string;
  value: number;
}

export const ForecastNextMonthKpi: React.FC<ForecastNextMonthKpiProps> = ({ month, value }) => {
  return <KpiCard label="Forecast Next Month" value={`$${value.toLocaleString()}`} helperText={`Target for ${month}`} />;
};
