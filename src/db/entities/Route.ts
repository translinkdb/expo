import { cleanRouteNumber } from "translinkjs";
import { SimpleMap } from "../../structures/helpers";
import { Agency } from "../../structures/GTFSStatic/shared";
import { Entity } from "../entity";
import { toInt } from "../helpers";

export class Route implements Entity {
  id: number;
  // This doesn't need to be a column because it's always "TL" (at least for now)
  agency: Agency;
  number: string;
  name: string;

  // Unused by Translink
  // description: string;
  // url: string

  constructor(raw: SimpleMap<string>) {
    this.id = toInt(raw.id)!;
    this.agency = (raw.agency as Agency) || Agency.Translink;
    this.number = cleanRouteNumber(raw.number);
    this.name = raw.name;
  }

  asInsertable(): SimpleMap {
    return {
      id: this.id,
      number: this.number,
      name: this.name,
    };
  }
}

export class RapidTransitRoute extends Route implements Entity {
  // Translink only uses these for rapid transit routes (eg. Rapidbus, Skytrain, Seabus)
  color!: string;
  textColor!: string;
  type!: RouteType;

  constructor(raw: SimpleMap<string>) {
    super(raw);

    this.type = toInt(raw.type)!;
    this.color = raw.color;
    this.textColor = raw.text_color;
  }

  asInsertable(): SimpleMap<any> {
    return {
      ...super.asInsertable(),
      color: this.color,
      text_color: this.textColor,
      type: this.type,
    };
  }
}

export function isRapidTransitRoute(raw: SimpleMap<string>): boolean {
  return !!raw.color;
}

// https://developers.google.com/transit/gtfs/reference#routestxt
export enum RouteType {
  LightRail = 0,
  SkyTrain = 1,
  Rail = 2,
  Bus = 3,
  Ferry = 4,
  CableTram = 5,
  // Eg. Gondola
  AerielLift = 6,
  Funicular = 7,
  // Despite this type, Translink designates it's trolleybus routes as 3, for Bus
  Trolleybus = 11,
  Monorail = 12,
}
