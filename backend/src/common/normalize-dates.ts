// src/common/normalize-dates.ts
export function normalizeDates<T extends Record<string, any>>(
  input: T,
  fields: (keyof T)[]
): T {
  const normalized = { ...input };

  for (const field of fields) {
    const value = input[field];
    if (value) {
      (normalized as any)[field] = new Date(value as any);
    }
  }

  return normalized;
}
