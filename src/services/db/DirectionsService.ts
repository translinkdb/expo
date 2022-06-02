import { db } from "../../db";
import { Direction } from "../../db/entities/Direction";

export class DirectionsService {
  public async ingest(directions: Direction[]) {
    await db
      .insert(directions.map((d) => d.asInsertable()))
      .into("directions")
      .onConflict(["direction_id", "route_id"])
      .merge();
  }
}
