import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface MethodComparisonPoint {
  month: string;
  [method: string]: string | number;
}

interface MethodComparisonChartProps {
  data: MethodComparisonPoint[];
  methods: string[];
  title?: string;
}

const palette = ['#14b8a6', '#8b5cf6', '#f59e0b', '#ec4899'];

export const MethodComparisonChart: React.FC<MethodComparisonChartProps> = ({ data, methods, title }) => {
  return (
    <section style={{ width: '100%', height: 320 }}>
      {title ? <h3>{title}</h3> : null}
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {methods.map((method, index) => (
            <Bar key={method} dataKey={method} fill={palette[index % palette.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};
