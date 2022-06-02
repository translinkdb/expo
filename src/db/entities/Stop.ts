import { Coordinates } from "translinkjs";
import { SimpleMap } from "../../structures/helpers";
import { Entity } from "../entity";
import { toFloat, toInt } from "../../helpers/typeConverters";

export class Stop implements Entity {
  id!: number;
  code!: string;
  name!: string;
  latitude!: number;
  longitude!: number;
  zone!: string;
  parentStopID?: number;

  // Unused by Translink
  // description: string
  // url: string

  constructor(raw: SimpleMap) {
    this.id = toInt(raw.id)!;
    this.code = raw.code;
    this.name = raw.name;
    this.latitude = toFloat(raw.latitude)!;
    this.longitude = toFloat(raw.longitude)!;
    this.zone = raw.zone;
    this.parentStopID = toInt(raw.parent_stop_id);
  }

  asInsertable(): SimpleMap<any> {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      latitude: this.latitude,
      longitude: this.longitude,
      zone: this.zone,
      parent_stop_id: this.parentStopID,
    };
  }

  get coordinates(): Coordinates {
    return { longitude: this.longitude, latitude: this.latitude };
  }
}

export enum StopLocationType {
  Stop = 0,
  Station = 1,
  EntranceExit = 2,
  GenericNode = 3,
  BoardingArea = 4,
}
