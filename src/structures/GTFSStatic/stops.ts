import { Coordinates } from "translinkjs";
import { SimpleMap } from "../helpers";

export class Stop {
  id: string;
  code: string;
  name: string;
  coordinates: Coordinates;
  zone: string;
  parentStationID: string;

  // Unused by Translink
  // description: string
  // url: string

  constructor(raw: SimpleMap) {
    this.id = raw.id;
    this.code = raw.code;
    this.name = raw.name;
    this.coordinates = {
      latitude: parseFloat(raw.latitude),
      longitude: parseFloat(raw.longitude),
    };
    this.zone = raw.zone;
    this.parentStationID = raw.parentStationID;
  }
}

export enum StopLocationType {
  Stop = 0,
  Station = 1,
  EntranceExit = 2,
  GenericNode = 3,
  BoardingArea = 4,
}
