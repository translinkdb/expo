import { toInt } from "../../helpers/typeConverters";
import { SimpleMap } from "../../structures/helpers";
import { Entity } from "../entity";

export class Pattern implements Entity {
  id: number;
  name: string;
  shapeID: number;

  constructor(raw: SimpleMap) {
    this.id = toInt(raw.id)!;
    this.name = raw.name;
    this.shapeID = toInt(raw.shape_id)!;
  }

  asInsertable(): SimpleMap<any> {
    return {
      id: this.id,
      name: this.name,
      shape_id: this.shapeID,
    };
  }
}

export class RoutePattern implements Entity {
  id?: number;
  routeID: number;
  patternID: number;

  constructor(raw: SimpleMap) {
    this.id = toInt(raw.id);
    this.routeID = toInt(raw.route_id)!;
    this.patternID = toInt(raw.pattern_id)!;
  }

  asInsertable(): SimpleMap<any> {
    return {
      id: this.id,
      route_id: this.routeID,
      pattern_id: this.patternID,
    };
  }
}
