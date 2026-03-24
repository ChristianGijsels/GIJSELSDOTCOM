import {
  MonthlyPoint,
  Product,
  ProductRegionSeries,
  Region,
} from "../models/forecast";
import { generateMonthSequence, monthLabel } from "../utils/time";

type Rng = () => number;

const PRODUCT_NAME_POOL = [
  "Atlas",
  "Beacon",
  "Comet",
  "Delta",
  "Echo",
  "Flux",
  "Glide",
  "Halo",
  "Ion",
  "Jade",
  "Kepler",
  "Lumen",
  "Mosaic",
  "Nova",
  "Orion",
];

const REGION_NAME_POOL = [
  "North America",
  "Europe",
  "APAC",
  "LATAM",
  "Middle East",
  "Africa",
  "Oceania",
];

export interface MonthlyHistoryParams {
  baseLevel: number;
  trendSlope: number;
  seasonalityAmplitude: number;
  noiseScale?: number;
  eventProbability?: number;
  rng?: Rng;
  endDate?: Date;
}

export interface DatasetParams {
  productCount: number;
  regionCount: number;
  monthsRange: number | { min: number; max: number };
  seed?: number;
  endDate?: Date;
}

export function generateProducts(count: number): Product[] {
  const total = Math.max(0, Math.floor(count));

  return Array.from({ length: total }, (_, index) => ({
    id: `product-${index + 1}`,
    name: PRODUCT_NAME_POOL[index] ?? `Product ${index + 1}`,
    baseLevel: 80 + index * 18,
    trendSlope: 1.1 + (index % 5) * 0.4,
    seasonalityAmplitude: 0.06 + (index % 4) * 0.03,
  }));
}

export function generateRegions(): Region[] {
  return REGION_NAME_POOL.map((name, index) => ({
    id: `region-${index + 1}`,
    name,
    multiplier: 0.85 + index * 0.08,
  }));
}

export function generateMonthlyHistory(
  months: number,
  params: MonthlyHistoryParams,
): MonthlyPoint[] {
  const totalMonths = Math.max(0, Math.floor(months));
  if (totalMonths === 0) {
    return [];
  }

  const {
    baseLevel,
    trendSlope,
    seasonalityAmplitude,
    noiseScale = Math.max(3, baseLevel * 0.04),
    eventProbability = 0.04,
    rng = Math.random,
    endDate,
  } = params;

  const monthsList = generateMonthSequence(totalMonths, endDate);

  return monthsList.map((date, index) => {
    const monthIndex = date.getMonth();
    const trend = trendSlope * index;
    const seasonality =
      baseLevel *
      seasonalityAmplitude *
      (Math.sin((2 * Math.PI * monthIndex) / 12) +
        0.6 * Math.cos((2 * Math.PI * monthIndex) / 12));

    const noise = gaussian(rng, 0, noiseScale);
    const event =
      rng() < eventProbability ? gaussian(rng, 0, baseLevel * 0.25) : 0;

    return {
      date,
      month: monthLabel(date),
      value: roundTo2(Math.max(0, baseLevel + trend + seasonality + noise + event)),
    };
  });
}

export function generateDataset({
  productCount,
  regionCount,
  monthsRange,
  seed,
  endDate,
}: DatasetParams): ProductRegionSeries[] {
  const rng = createRng(seed);
  const products = generateProducts(productCount);
  const regions = getRegionsForCount(regionCount);

  return products.flatMap((product) =>
    regions.map((region) => {
      const months = resolveMonthsCount(monthsRange, rng);
      const baseLevel = product.baseLevel * region.multiplier;
      const trendSlope = product.trendSlope * (0.9 + rng() * 0.2);
      const seasonalityAmplitude = product.seasonalityAmplitude * (0.9 + rng() * 0.25);

      return {
        key: {
          productId: product.id,
          regionId: region.id,
        },
        product,
        region,
        points: generateMonthlyHistory(months, {
          baseLevel,
          trendSlope,
          seasonalityAmplitude,
          noiseScale: Math.max(2, baseLevel * 0.035),
          eventProbability: 0.03,
          rng,
          endDate,
        }),
      };
    }),
  );
}

function getRegionsForCount(count: number): Region[] {
  const total = Math.max(0, Math.floor(count));
  const availableRegions = generateRegions();

  return Array.from({ length: total }, (_, index) => {
    const existing = availableRegions[index];
    if (existing) {
      return existing;
    }

    return {
      id: `region-${index + 1}`,
      name: `Region ${index + 1}`,
      multiplier: 0.85 + (index % availableRegions.length) * 0.08,
    };
  });
}

function resolveMonthsCount(
  monthsRange: number | { min: number; max: number },
  rng: Rng,
): number {
  if (typeof monthsRange === "number") {
    return Math.max(1, Math.floor(monthsRange));
  }

  const min = Math.max(1, Math.floor(monthsRange.min));
  const max = Math.max(min, Math.floor(monthsRange.max));

  return min + Math.floor(rng() * (max - min + 1));
}

function gaussian(rng: Rng, mean: number, stdDev: number): number {
  const u1 = Math.max(rng(), Number.EPSILON);
  const u2 = rng();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z0 * stdDev;
}

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

function createRng(seed?: number): Rng {
  if (seed === undefined) {
    return Math.random;
  }

  let state = (Math.floor(seed) >>> 0) || 1;

  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
