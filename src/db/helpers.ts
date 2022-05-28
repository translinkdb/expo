export function toInt(value?: string | number): number | undefined {
  if (typeof value === "number") return value;

  const parsed = parseInt(value || "");

  return isNaN(parsed) ? undefined : parsed;
}

export function toFloat(value?: string | number): number | undefined {
  if (typeof value === "number") return value;

  const parsed = parseFloat(value || "");

  return isNaN(parsed) ? undefined : parsed;
}
