import React from 'react';
import { KpiCard } from './KpiCard';

interface TotalSalesKpiProps {
  totalSales: number;
}

export const TotalSalesKpi: React.FC<TotalSalesKpiProps> = ({ totalSales }) => {
  return <KpiCard label="Total Sales" value={`$${totalSales.toLocaleString()}`} helperText="Historical period sum" />;
};
