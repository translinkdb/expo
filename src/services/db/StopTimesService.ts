import { db } from "../../db";
import { StopTime } from "../../db/entities/StopTime";
import { chunk } from "../../helpers/array";

export class StopTimesService {
  public async ingest(stopTimes: StopTime[]) {
    const chunks = chunk(stopTimes, 5000);

    for (const chunk of chunks) {
      await db
        .insert(chunk.map((sp) => sp.asInsertable()))
        .into("stop_times")
        .onConflict(["trip_id", "order"])
        .merge();
    }
  }
}
