import { fromUnixTime } from "date-fns";
import { Coordinates, GTFSVehiclePosition } from "translinkjs";
import { Trip } from "../../db/entities/Trip";
import { toInt } from "../../helpers/typeConverters";

export class VehiclePosition {
  position: Coordinates;
  timestamp: Date;
  tripID: number;
  vehicleID: number;

  trip!: Trip;

  // stopID: string;
  // stop!: Stop;
  // setStop(stop: Stop) {
  //   this.stop = stop;
  // }

  constructor(raw: {
    position: Coordinates;
    timestamp: Date;
    tripID: number;
    vehicleID: number;
  }) {
    this.position = raw.position;
    this.timestamp = raw.timestamp;
    this.tripID = raw.tripID;
    this.vehicleID = raw.vehicleID;
  }

  setTrip(trip?: Trip) {
    this.trip = trip!;
  }

  asJSON(): string {
    return JSON.stringify({
      position: this.position,
      timestamp: this.timestamp.getTime(),
      tripID: this.trip?.id || this.tripID,
      vehicleID: this.vehicleID,
    });
  }

  static fromTranslinkJS(
    vehiclePosition: GTFSVehiclePosition
  ): VehiclePosition {
    return new VehiclePosition({
      position: vehiclePosition.position,
      timestamp: vehiclePosition.timestamp,
      tripID: toInt(vehiclePosition.trip.id)!,
      vehicleID: toInt(vehiclePosition.vehicle.id)!,
    });
  }

  static fromJSON(json: string): VehiclePosition {
    const parsed = JSON.parse(json);

    return new VehiclePosition({
      position: parsed.position,
      timestamp: fromUnixTime(parsed.timestamp),
      tripID: toInt(parsed.tripID)!,
      vehicleID: toInt(parsed.vehicleID)!,
    });
  }
}
