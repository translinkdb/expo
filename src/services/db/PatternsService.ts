import { db } from "../../db";
import { Pattern } from "../../db/entities/Pattern";
import { chunk } from "../../helpers/array";

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
}
