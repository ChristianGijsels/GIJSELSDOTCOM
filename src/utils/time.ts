const DEFAULT_LOCALE = "en-US";

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, monthsToAdd: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + monthsToAdd, 1);
}

export function monthLabel(date: Date, locale = DEFAULT_LOCALE): string {
  return date.toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  });
}

export function generateMonthSequence(months: number, endDate = new Date()): Date[] {
  if (months <= 0) {
    return [];
  }

  const endMonth = startOfMonth(endDate);
  const startMonth = addMonths(endMonth, -(months - 1));

  return Array.from({ length: months }, (_, index) => addMonths(startMonth, index));
}
