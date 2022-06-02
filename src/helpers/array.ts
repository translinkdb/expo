import { SimpleMap } from "../structures/helpers";

export function uniquify<T>(
  array: T[],
  bykeys?: string[] | ((item: SimpleMap) => string)
): T[] {
  if (bykeys) return uniquifyWithKeys(array, bykeys);

  return Array.from(new Set(array));
}

function uniquifyWithKeys<T extends SimpleMap>(
  array: T[],
  byKeys: string[] | ((item: SimpleMap) => string)
): T[] {
  const keyGenerator = (item: SimpleMap) => {
    return typeof byKeys === "function"
      ? byKeys(item)
      : byKeys.reduce((acc, val) => {
          return acc + `${item[val]}`;
        }, "");
  };

  return Array.from(
    new Map(array.map((item) => [keyGenerator(item), item])).values()
  );
}

export function chunk<T>(array: T[], perChunk: number): T[][] {
  return array.reduce((acc, val, idx) => {
    const chunkIndex = Math.floor(idx / perChunk);

    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []; // start a new chunk
    }

    acc[chunkIndex].push(val);

    return acc;
  }, [] as T[][]);
}
