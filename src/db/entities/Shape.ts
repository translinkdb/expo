import { Coordinates } from "translinkjs";
import { SimpleMap } from "../../structures/helpers";
import { Entity } from "../entity";
import { toFloat, toInt } from "../../helpers/typeConverters";

export class Shape implements Entity {
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  asInsertable(): SimpleMap<any> {
    return { id: this.id };
  }
}

export class ShapePoint implements Entity {
  shapeID: number;
  latitude: number;
  longitude: number;
  order: number;
  cumulativeDistance: number;

  constructor(raw: SimpleMap) {
    this.shapeID = toInt(raw.shape_id)!;
    this.latitude = toFloat(raw.latitude)!;
    this.longitude = toFloat(raw.longitude)!;
    this.order = toInt(raw.order)!;
    this.cumulativeDistance = toFloat(raw.cumulative_distance)!;
  }

  get coordinates(): Coordinates {
    return { longitude: this.longitude, latitude: this.latitude };
  }

  asInsertable(): SimpleMap<any> {
    return {
      shape_id: this.shapeID,
      latitude: this.latitude,
      longitude: this.longitude,
      order: this.order,
      cumulative_distance: this.cumulativeDistance,
    };
  }
}
