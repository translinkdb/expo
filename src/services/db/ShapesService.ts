import { db } from "../../db";
import { Shape, ShapePoint } from "../../db/entities/Shape";
import { chunk, uniquify } from "../../helpers/array";

export class ShapesService {
  public async ingest(shapePoints: ShapePoint[]) {
    const shapes = uniquify(shapePoints.map((s) => s.shapeID))
      .filter((s) => s !== undefined)
      .map((s) => new Shape({ id: s }));

    await db
      .insert(shapes.map((s) => s.asInsertable()))
      .into("shapes")
      .onConflict()
      .ignore();

    const chunks = chunk(shapePoints, 1000);

    for (const chunk of chunks) {
      await db
        .insert(chunk.map((sp) => sp.asInsertable()))
        .into("shape_points")
        .onConflict(["shape_id", "order"])
        .merge();
    }
  }
}
