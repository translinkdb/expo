import { SimpleMap } from "../../structures/helpers";
import { Entity } from "../entity";
import { toBoolean, toDate, toInt } from "../../helpers/typeConverters";

export class Service implements Entity {
  id: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  startDate: Date;
  endDate: Date;
  name?: string;

  constructor(raw: SimpleMap) {
    this.id = raw.id;
    this.monday = toBoolean(raw.monday);
    this.tuesday = toBoolean(raw.tuesday);
    this.wednesday = toBoolean(raw.wednesday);
    this.thursday = toBoolean(raw.thursday);
    this.friday = toBoolean(raw.friday);
    this.saturday = toBoolean(raw.saturday);
    this.sunday = toBoolean(raw.sunday);
    this.startDate = toDate(raw.start_date)!;
    this.endDate = toDate(raw.end_date)!;
    this.name = raw.name;
  }

  asInsertable(): SimpleMap<any> {
    return {
      id: this.id,
      monday: this.monday,
      tuesday: this.tuesday,
      wednesday: this.wednesday,
      thursday: this.thursday,
      friday: this.friday,
      saturday: this.saturday,
      sunday: this.sunday,
      start_date: this.startDate,
      end_date: this.endDate,
      name: this.name,
    };
  }
}

export enum ServiceExceptionType {
  ServiceAdded = 1,
  ServiceRemoved = 2,
}

export class ServiceException implements Entity {
  serviceID: string;
  date: Date;
  type: ServiceExceptionType;

  constructor(raw: SimpleMap) {
    this.serviceID = raw.service_id!;
    this.date = toDate(raw.date)!;
    this.type = raw.type;
  }

  asInsertable(): SimpleMap<any> {
    return {
      service_id: this.serviceID,
      date: this.date,
      type: this.type,
    };
  }
}
