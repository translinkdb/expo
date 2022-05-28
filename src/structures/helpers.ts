export type SimpleMap<T = any> = {
  [key: string]: T;
};

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function isCoordinates(value: any): value is Coordinates {
  return (
    typeof value?.latitude === "number" && typeof value?.longitude === "number"
  );
}

export function convertMetersToDegrees(meters: number): number {
  return meters / 111_139;
}
