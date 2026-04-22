import { ProductForecast } from '../types/forecast';

const genSeries = (base: number, seasonalOffset: number, growth = 0.03) => {
  const months = [
    '2025-01',
    '2025-02',
    '2025-03',
    '2025-04',
    '2025-05',
    '2025-06',
    '2025-07',
    '2025-08',
    '2025-09',
    '2025-10',
    '2025-11',
    '2025-12',
  ];

  return months.map((month, i) => {
    const seasonal = Math.sin((i / 12) * Math.PI * 2) * seasonalOffset;
    const historical = Math.round(base * Math.pow(1 + growth, i) + seasonal);
    const forecast = Math.round(historical * (1 + 0.01 * ((i % 3) - 1)));

    return {
      month,
      historical,
      forecast,
    };
  });
};

export const mockForecastData: ProductForecast[] = [
  {
    productId: 'P-100',
    productName: 'Smart Sensor',
    region: 'North America',
    points: genSeries(1800, 160),
  },
  {
    productId: 'P-200',
    productName: 'Industrial Hub',
    region: 'Europe',
    points: genSeries(1350, 140),
  },
  {
    productId: 'P-300',
    productName: 'Edge Gateway',
    region: 'Asia Pacific',
    points: genSeries(1700, 210),
  },
  {
    productId: 'P-100',
    productName: 'Smart Sensor',
    region: 'Latin America',
    points: genSeries(920, 95),
  },
];
