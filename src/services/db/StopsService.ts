import { db } from "../../db";
import { Stop } from "../../db/entities/Stop";
import { applyFilters } from "../../db/helpers/filters";
import { StopsFilters } from "../../structures/graphql/filters";
import { SimpleMap } from "../../structures/helpers";

export class StopsService {
  async ingest(stops: Stop[]) {
    const insertables = stops.map((s) => s.asInsertable());

    await db.insert(insertables).into("stops").onConflict("id").merge();
  }

  public async list(filters?: StopsFilters): Promise<Stop[]> {
    const query = applyFilters(db.queryBuilder(), filters || {});

    const stops: SimpleMap[] = await query.select().from("stops").limit(100);

    return stops.map((s) => new Stop(s));
  }
}
