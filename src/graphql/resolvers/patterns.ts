import { db } from "../../db";
import { Pattern } from "../../db/entities/Pattern";
import { Shape } from "../../db/entities/Shape";

export async function patternHeadsignResolver(
  parent: Pattern
): Promise<string> {
  const result = await db
    .select("headsign")
    .from("route_patterns")
    .join("trips", "trips.route_pattern_id", "=", "route_patterns.id")
    .where("pattern_id", "=", parent.id)
    .limit(1);

  return result[0]?.headsign || "";
}

export async function patternTripCountResolver(
  parent: Pattern
): Promise<number> {
  const result = await db
    .count("trips.id")
    .from("trips")
    .join("route_patterns", "route_patterns.id", "=", "trips.route_pattern_id")
    .where("pattern_id", "=", parent.id);

  return (result[0]?.count as number) || 0;
}

export async function patternShapeResolver(parent: Pattern): Promise<Shape> {
  const result = await db
    .select("shapes.*")
    .from("shapes")
    .where("shapes.id", "=", parent.shapeID);

  return new Shape(result[0] || {});
}
