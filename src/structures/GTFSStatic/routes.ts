import { cleanRouteNumber } from "translinkjs";
import { SimpleMap } from "../helpers";
import { Agency } from "./shared";

export class Route {
  id: string;
  agency: Agency;
  number: string;
  name: string;
  type: RouteType;

  // Unused by Translink
  // description: string;
  // url: string

  constructor(raw: SimpleMap<string>) {
    this.id = raw.id;
    this.agency = raw.agency as Agency;
    this.number = cleanRouteNumber(raw.number);
    this.name = raw.name;

    this.type = parseInt(raw.type);
  }
}

export class RapidTransitRoute extends Route {
  // Translink only uses these for rapid transit
  color: string;
  textColor: string;

  constructor(raw: SimpleMap<string>) {
    super(raw);

    this.color = raw.color;
    this.textColor = raw.textColor;
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
