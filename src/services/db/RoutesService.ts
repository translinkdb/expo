import { db } from "../../db";
import { RapidTransitRoute, Route } from "../../db/entities/Route";
import { toInt } from "../../helpers/typeConverters";
import { applyFilters } from "../../db/helpers/filters";
import { RoutesFilters } from "../../structures/graphql/filters";
import { SimpleMap } from "../../structures/helpers";

export const UnknownRouteNumber = "?";

export class RoutesService {
  public async ingest(
    routes: Route[],
    rapidTransitRoutes: RapidTransitRoute[]
  ) {
    const rapidInsertables = rapidTransitRoutes.map((r) => r.asInsertable());

    await Promise.all([
      this.insertRoutes(routes, "merge"),
      db
        .insert(rapidInsertables)
        .into("rapid_transit_routes")
        .onConflict("id")
        .merge(),
    ]);
  }

  public async get(id: string | number): Promise<Route | undefined> {
    const route = await db
      .where({ id: toInt(id) })
      .select()
      .from("routes");

    return route[0] ? new Route(route[0]) : undefined;
  }

  public async list(filters?: RoutesFilters): Promise<Route[]> {
    const query = applyFilters(db.queryBuilder(), filters || {});

    const routes: SimpleMap[] = await query
      .select()
      .whereNot("number", "=", "?")
      .orderByRaw("NULLIF(regexp_replace(number, '\\D', '9999', 'g'), '')::int")
      .from("routes");

    return routes.map((r) => new Route(r));
  }

  public async insertUnknownRoutes(routeIDs: number[]) {
    const unknownRoutes = routeIDs.map(
      (id) =>
        new Route({
          id: id,
          number: UnknownRouteNumber,
          name: "Unknown Route",
        })
    );

    await this.insertRoutes(unknownRoutes);
  }

  private async insertRoutes(
    routes: Route[],
    onConflict: "merge" | "ignore" = "ignore"
  ) {
    const query = db
      .insert(routes.map((r) => r.asInsertable()))
      .into("routes")
      .onConflict("id");

    await (onConflict === "merge" ? query.merge() : query.ignore());
  }
}
