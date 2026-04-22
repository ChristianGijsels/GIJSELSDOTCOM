import React from 'react';
import { KpiCard } from './KpiCard';

interface ForecastErrorKpiProps {
  errorRate: number;
}

export const ForecastErrorKpi: React.FC<ForecastErrorKpiProps> = ({ errorRate }) => {
  return <KpiCard label="Forecast Error" value={`${errorRate.toFixed(2)}%`} helperText="Mean absolute percentage error" />;
};
