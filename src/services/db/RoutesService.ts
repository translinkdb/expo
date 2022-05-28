import { db } from "../../db";
import { RapidTransitRoute, Route } from "../../db/entities/Route";
import { toInt } from "../../db/helpers";
import { applyFilters } from "../../db/helpers/filters";
import { RoutesFilters } from "../../structures/graphql/filters";
import { SimpleMap } from "../../structures/helpers";

export class RoutesService {
  public async ingest(
    routes: Route[],
    rapidTransitRoutes: RapidTransitRoute[]
  ) {
    const routeInsertables = routes.map((r) => r.asInsertable());
    const rapidInsertables = rapidTransitRoutes.map((r) => r.asInsertable());

    await Promise.all([
      db.insert(routeInsertables).into("routes").onConflict("id").merge(),
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

    const routes: SimpleMap[] = await query.select().from("routes");

    return routes.map((r) => new Route(r));
  }
}
