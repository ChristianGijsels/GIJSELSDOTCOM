import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface HistoricalForecastLineChartProps<TData extends Record<string, string | number>> {
  data: TData[];
  xKey?: keyof TData;
  historicalKey?: keyof TData;
  forecastKey?: keyof TData;
  title?: string;
}

export function HistoricalForecastLineChart<TData extends Record<string, string | number>>({
  data,
  xKey = 'month' as keyof TData,
  historicalKey = 'historical' as keyof TData,
  forecastKey = 'forecast' as keyof TData,
  title,
}: HistoricalForecastLineChartProps<TData>) {
  return (
    <section style={{ width: '100%', height: 360 }}>
      {title ? <h3>{title}</h3> : null}
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={String(xKey)} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={String(historicalKey)} stroke="#2563eb" strokeWidth={2} name="Historical" />
          <Line type="monotone" dataKey={String(forecastKey)} stroke="#f97316" strokeDasharray="5 5" strokeWidth={2} name="Forecast" />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
