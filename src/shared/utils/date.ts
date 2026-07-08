const DATE_LIKE_PATTERN = /^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/;

// "2025.06.30" | "2025-6-3" | "2025/06/30" → "2025-06-30", 그 외("상시모집" 등)는 null
export function toIsoDateString(value: string): string | null {
  const match = DATE_LIKE_PATTERN.exec(value.trim());
  if (!match) return null;

  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
