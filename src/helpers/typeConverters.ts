import { fromUnixTime, parse } from "date-fns";
import { Time } from "../db/entities/StopTime";

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

export function toBoolean(value?: string | number | boolean): boolean {
  if (!value) return false;

  return value === "1" || value === 1;
}

export function toDate(value?: string | number | Date): Date | undefined {
  if (value instanceof Date) return value;
  if (typeof value === "undefined") return undefined;
  if (typeof value === "number") return fromUnixTime(value);

  if (value.length === 8) return parse(value, "yyyyMMdd", new Date());

  return fromUnixTime(toInt(value)!);
}

export function toTime(value?: string | Date | Time): Time | undefined {
  if (!value) return undefined;
  if (value instanceof Time) return value;

  if (typeof value === "string") return Time.fromString(value);
  if (value instanceof Date) return Time.fromDate(value);
}
