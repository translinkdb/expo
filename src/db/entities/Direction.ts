import { SimpleMap } from "../../structures/helpers";
import { Entity } from "../entity";
import { toInt } from "../../helpers/typeConverters";

type CardinalDirection = "EAST" | "WEST" | "NORTH" | "SOUTH";

export class Direction implements Entity {
  directionID: number;
  cardinalDirection: CardinalDirection;
  routeID: number;
  name: string;

  constructor(raw: SimpleMap) {
    this.directionID = toInt(raw.direction_id)!;
    this.cardinalDirection = raw.cardinal_direction as CardinalDirection;
    this.routeID = toInt(raw.route_id)!;
    this.name = raw.name;
  }

  asInsertable(): SimpleMap<any> {
    return {
      direction_id: this.directionID,
      cardinal_direction: this.cardinalDirection,
      route_id: this.routeID,
      name: this.name,
    };
  }
}
