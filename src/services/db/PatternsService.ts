import { db } from "../../db";
import { Pattern } from "../../db/entities/Pattern";
import { applyFilters } from "../../db/helpers/filters";
import { chunk } from "../../helpers/array";
import { PatternsFilters } from "../../structures/graphql/filters";
import { SimpleMap } from "../../structures/helpers";

export const UnknownPatternID = -1;

export class PatternsService {
  public async ingest(patterns: Pattern[]) {
    const chunks = chunk(patterns, 5000);

    for (const chunk of chunks) {
      await db
        .insert(chunk.map((p) => p.asInsertable()))
        .into("patterns")
        .onConflict(["id"])
        .merge();
    }
  }

  public async fetchPatterns(routeID: number): Promise<Pattern[]> {
    const raw = await db
      .select("patterns.*")
      .from("route_patterns")
      .join("patterns", "patterns.id", "=", "route_patterns.pattern_id")
      .where("route_id", "=", routeID);

    return raw.map((r) => new Pattern(r));
  }

  public async ensureUnknownPatternExists() {
    await db
      .insert({ id: UnknownPatternID, name: "?" })
      .into("patterns")
      .onConflict("id")
      .ignore();
  }

  public async get(id: number): Promise<Pattern> {
    const raw = await db.select("*").from("patterns").where("id", "=", id);

    return new Pattern(raw[0]);
  }

  public async list(filters: PatternsFilters): Promise<Pattern[]> {
    const query = applyFilters(db.queryBuilder(), filters || {});

    const patterns: SimpleMap[] = await query.select().from("patterns");

    return patterns.map((p) => new Pattern(p));
  }
}
