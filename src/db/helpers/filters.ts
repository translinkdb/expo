import type { Knex } from "knex";
import {
  isStringFilter,
  StringFilter,
  isCoordinatesFilter,
  CoordinatesFilter,
} from "../../structures/graphql/filters";
import { convertMetersToDegrees, SimpleMap } from "../../structures/helpers";

export function applyFilters(
  query: Knex.QueryBuilder,
  filters: SimpleMap,
  converters?: SimpleMap
): Knex.QueryBuilder {
  let builder = query;

  for (const [key, filter] of Object.entries(filters)) {
    const column = getColumn(key, converters);

    if (isStringFilter(filter)) {
      builder = applyStringFilter(builder, column, filter);
    } else if (isCoordinatesFilter(filter)) {
      builder = applyCoordinatesFilter(builder, filter);
    }
  }

  return builder;
}

function getColumn(key: string, converters: SimpleMap | undefined) {
  return converters ? converters[key] || key : key;
}

function applyStringFilter(
  query: Knex.QueryBuilder,
  column: string,
  filter: StringFilter
): Knex.QueryBuilder {
  if (!filter.contains && !filter.exact) return query;

  return query.whereILike(
    column,
    filter.exact ? filter.exact : `%${filter.contains}%`
  );
}

function applyCoordinatesFilter(
  query: Knex.QueryBuilder,
  filter: CoordinatesFilter
): Knex.QueryBuilder {
  if (filter.exact) {
    return query
      .where("latitude", filter.exact.latitude)
      .where("longitude", filter.exact.longitude);
  } else if (filter.near && filter.radius) {
    const deg = convertMetersToDegrees(filter.radius);

    return query
      .whereRaw(
        ":lat::float - :deg::float < latitude AND latitude < :lat::float + :deg::float",
        {
          deg,
          lat: filter.near.latitude,
        }
      )
      .whereRaw(
        ":long::float - :deg::float < longitude AND longitude < :long::float + :deg::float",
        {
          deg,
          long: filter.near.longitude,
        }
      );
  }

  return query;
}
