import {
  toBoolean,
  toFloat,
  toInt,
  toTime,
} from "../../helpers/typeConverters";
import { SimpleMap } from "../../structures/helpers";
import { Entity } from "../entity";

export class Time {
  hour: number;
  minute: number;
  second: number;

  constructor(hour: number, minute: number, second: number) {
    this.hour = hour >= 24 ? hour - 24 : hour;
    this.minute = minute;
    this.second = second;
  }

  asInsertable(): string {
    return [this.hour, this.minute, this.second]
      .map((e) => `${e}`.padStart(2, "0"))
      .join(":");
  }

  static fromString(string: string): Time {
    const [hour, minute, second] = string.split(":");

    return new Time(toInt(hour)!, toInt(minute)!, toInt(second)!);
  }

  static fromDate(date: Date): Time {
    return new Time(date.getHours(), date.getMinutes(), date.getSeconds());
  }
}

export class StopTime implements Entity {
  tripID: number;
  stopID: number;
  arrival: Time;
  departure?: Time;
  order: number;
  isPickupRestricted: boolean;
  isDropoffRestricted: boolean;
  cumulativeDistance: number;

  constructor(raw: SimpleMap) {
    if (raw.arrival === raw.departure) raw.departure === undefined;

    this.tripID = toInt(raw.trip_id)!;
    this.stopID = toInt(raw.stop_id)!;
    this.arrival = toTime(raw.arrival)!;
    this.departure = toTime(raw.departure);
    this.order = toInt(raw.order)!;
    this.isPickupRestricted = toBoolean(raw.is_pickup_restricted);
    this.isDropoffRestricted = toBoolean(raw.is_dropoff_restricted);
    this.cumulativeDistance = toFloat(raw.cumulative_distance)!;
  }

  asInsertable(): SimpleMap<any> {
    return {
      trip_id: this.tripID,
      stop_id: this.stopID,
      arrival: this.arrival.asInsertable(),
      departure: this.departure?.asInsertable(),
      order: this.order,
      is_pickup_restricted: this.isPickupRestricted,
      is_dropoff_restricted: this.isDropoffRestricted,
      cumulative_distance: this.cumulativeDistance,
    };
  }
}
