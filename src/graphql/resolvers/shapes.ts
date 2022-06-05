import { db } from "../../db";
import { Shape, ShapePoint } from "../../db/entities/Shape";

export async function shapePointsResolver(
  parent: Shape
): Promise<ShapePoint[]> {
  const results = await db
    .select("*")
    .from("shape_points")
    .where("shape_id", "=", parent.id)
    .orderBy("order");

  return results.map((r) => new ShapePoint(r));
}
