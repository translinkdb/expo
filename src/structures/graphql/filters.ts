import { Coordinates, isCoordinates, SimpleMap } from "../helpers";

// Filter types

export interface StringFilter {
  exact?: string;
  contains?: string;
}

export function isStringFilter(filter: SimpleMap): filter is StringFilter {
  return typeof (filter.exact || filter.contains) === "string";
}

export interface CoordinatesFilter {
  near?: Coordinates;
  radius?: number;
  exact?: Coordinates;
}

export function isCoordinatesFilter(
  filter: SimpleMap
): filter is CoordinatesFilter {
  return (
    isCoordinates(filter.exact) ||
    (isCoordinates(filter.near) && typeof filter.radius === "number")
  );
}

// Query filters

export interface RoutesFilters {
  number?: StringFilter;
  name?: StringFilter;
}

export interface StopsFilters {
  code?: StringFilter;
  name?: StringFilter;
}
