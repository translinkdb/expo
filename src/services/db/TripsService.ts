import { db } from "../../db";
import { Pattern, RoutePattern } from "../../db/entities/Pattern";
import { Block, Trip } from "../../db/entities/Trip";
import { chunk, uniquify } from "../../helpers/array";
import { VehiclePosition } from "../../structures/GTFSRealtime/VehiclePosition";
import { SimpleMap } from "../../structures/helpers";
import { PatternsService } from "./PatternsService";
import { UnknownRouteNumber } from "./RoutesService";

export class TripsService {
  private patternsService = new PatternsService();

  // This method must be called *AFTER* routes and shapes have been inserted into the database
  // This also inserts the needed patterns and route patterns
  public async generateTrips(
    rawTrips: SimpleMap[],
    rawPatterns: SimpleMap[]
  ): Promise<Trip[]> {
    await this.patternsService.ensureUnknownPatternExists();

    const nonUnique = rawTrips.map((t) => {
      const pattern = rawPatterns.find((p) => p.trip_id === t.id);

      return {
        route_id: t.route_id,
        pattern_id: pattern?.id || UnknownRouteNumber,
      };
    });

    const routePatterns = uniquify(nonUnique, ["route_id", "pattern_id"]);

    const patterns = uniquify(rawPatterns, ["id"]).map(
      (p) =>
        new Pattern({
          ...p,
          shape_id: rawTrips.find((t) => t.id === p.trip_id)?.shape_id,
        })
    );

    await this.patternsService.ingest(patterns);

    await db
      .insert(routePatterns.map((p) => new RoutePattern(p).asInsertable()))
      .into("route_patterns")
      .onConflict(["route_id", "pattern_id"])
      .ignore()
      .returning(["id", "pattern_id"]);

    const results = await db.select("id", "pattern_id").from("route_patterns");

    const shapeToRoutePatternIDMap = await this.getRoutePatternIDMap(results);

    const trips = rawTrips.map(
      (t) =>
        new Trip({
          ...t,
          route_pattern_id: shapeToRoutePatternIDMap[t.shape_id],
        })
    );

    return trips;
  }

  public async ingest(trips: Trip[]) {
    const blocks = uniquify(trips.map((t) => t.blockID)).map(
      (b) => new Block({ id: b })
    );

    await db
      .insert(blocks.map((b) => b.asInsertable()))
      .into("blocks")
      .onConflict("id")
      .ignore();

    for (const tripsChunk of chunk(trips, 1000)) {
      await db
        .insert(tripsChunk.map((t) => t.asInsertable()))
        .into("trips")
        .onConflict(["id"])
        .merge();
    }
  }

  public async attachToVehiclePositions(
    vehiclePositions: VehiclePosition[]
  ): Promise<VehiclePosition[]> {
    const tripIDs = uniquify(vehiclePositions.map((vp) => vp.tripID));

    const results = await db.select("*").from("trips").whereIn("id", tripIDs);

    const trips = results.map((t) => new Trip(t));

    return vehiclePositions.map((vp) => {
      const trip = trips.find((t) => t.id === vp.tripID);

      vp.setTrip(trip);

      return vp;
    });
  }

  public async fetchRoutePattern(trip: Trip): Promise<RoutePattern> {
    const rp = await db
      .select("*")
      .from("route_patterns")
      .where("id", "=", trip.routePatternID);

    return new RoutePattern(rp[0]);
  }

  private async getRoutePatternIDMap(
    routePatterns: { id: number; pattern_id: number }[]
  ): Promise<SimpleMap<number>> {
    const results: { id: number; shape_id: number }[] = await db
      .select(["route_patterns.id as id", "shape_id"])
      .from("route_patterns")
      .join("patterns", "route_patterns.pattern_id", "=", "patterns.id")
      .whereIn(
        "route_patterns.id",
        routePatterns.map((rp) => rp.id)
      );

    return results.reduce((acc, { id, shape_id }) => {
      acc[shape_id] = id;

      return acc;
    }, {} as SimpleMap<number>);
  }
}
