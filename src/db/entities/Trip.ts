import { SimpleMap } from "../../structures/helpers";
import { Entity } from "../entity";
import { toInt } from "../../helpers/typeConverters";

export class Trip implements Entity {
  id: number;
  serviceID: string;

  headsign: string;
  directionID: number;
  blockID: string;
  routePatternID: number;

  // Unused by Translink
  // shortName: string;
  // isWheelchairAccessible: boolean
  // bikesAllowed: boolean

  // Moved to RoutePattern
  // shapeID: number;
  // routeID: number;

  constructor(raw: SimpleMap) {
    this.id = toInt(raw.id)!;
    this.serviceID = raw.service_id;
    this.headsign = raw.headsign;
    this.directionID = toInt(raw.direction_id)!;
    this.blockID = raw.block_id!;
    this.routePatternID = toInt(raw.route_pattern_id)!;
  }

  asInsertable(): SimpleMap<any> {
    return {
      id: this.id,
      service_id: this.serviceID,
      headsign: this.headsign,
      direction_id: this.directionID,
      block_id: this.blockID,
      route_pattern_id: this.routePatternID,
    };
  }
}

export class Block implements Entity {
  id: string;

  constructor(raw: SimpleMap) {
    this.id = raw.id!;
  }

  asInsertable(): SimpleMap<any> {
    return { id: this.id };
  }
}
