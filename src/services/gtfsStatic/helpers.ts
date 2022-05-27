import { ParsedCSV } from "../../structures/GTFSStatic/parser";
import { SimpleMap } from "../../structures/helpers";

export function convertToObjects(
  records: ParsedCSV,
  transforms: SimpleMap<string> = {}
): SimpleMap[] {
  return records.rows.map((r) =>
    r.reduce((acc, val, idx) => {
      const key = records.headers[idx];
      acc[transforms[key] || key] = val;

      return acc;
    }, {} as SimpleMap)
  );
}

export function processRecords(records: (string | number)[][]): ParsedCSV {
  return {
    headers: records[0] as string[],
    rows: records.slice(1),
  };
}
