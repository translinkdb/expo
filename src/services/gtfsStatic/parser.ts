import { parse } from "csv-parse";
import { ParsedCSV } from "../../structures/GTFSStatic/parser";
import {
  isRapidTransitRoute,
  RapidTransitRoute,
  Route,
} from "../../db/entities/Route";
import { Stop } from "../../db/entities/Stop";
import { convertToObjects, processRecords } from "./helpers";
import {
  directionExceptionKeyTransformers,
  directionKeyTransformers,
  patternKeyTransformers,
  routeKeyTransformers,
  serviceExceptionKeyTransformers,
  serviceKeyTransformers,
  shapeKeyTransformers,
  stopKeyTransformers,
  stopTimeKeyTransformers,
  tripKeyTransformers,
} from "./keyTransformers";
import { RoutesService } from "../db/RoutesService";
import { StopsService } from "../db/StopsService";
import { Direction } from "../../db/entities/Direction";
import { DirectionsService } from "../db/DirectionsService";
import { uniquify } from "../../helpers/array";
import { ShapePoint } from "../../db/entities/Shape";
import { ShapesService } from "../db/ShapesService";
import { Service, ServiceException } from "../../db/entities/Service";
import { ServicesService } from "../db/ServicesService";
import { TripsService } from "../db/TripsService";
import { StopTime } from "../../db/entities/StopTime";
import { StopTimesService } from "../db/StopTimesService";
import { SimpleMap } from "../../structures/helpers";
import AdmZip from "adm-zip";

// Structure: https://developers.google.com/transit/gtfs/reference
export class GTFSStaticParser {
  private stopsService = new StopsService();
  private routesService = new RoutesService();
  private directionsService = new DirectionsService();
  private shapesService = new ShapesService();
  private servicesService = new ServicesService();
  private tripsService = new TripsService();
  private stopTimesService = new StopTimesService();

  public async ingestAll(files: AdmZip.IZipEntry[]) {
    const { routes, rapidTransitRoutes } = await this.parseRoutes(
      getFile(files, "routes.txt")
    );
    const stops = await this.parseStops(getFile(files, "stops.txt"));
    const directions = await this.parseDirections(
      getFile(files, "directions.txt"),
      getFile(files, "direction_names_exceptions.txt")
    );
    const shapePoints = await this.parseShapes(getFile(files, "shapes.txt"));
    const { services, serviceExceptions } = await this.parseServices(
      getFile(files, "calendar.txt"),
      getFile(files, "calendar_dates.txt")
    );

    const stopTimes = await this.parseStopTimes(
      getFile(files, "stop_times.txt")
    );
    const tripObjects = await this.parseTrips(getFile(files, "trips.txt"));
    const patternObjects = await this.parsePatterns(
      getFile(files, "pattern_id.txt")
    );

    await this.stopsService.ingest(stops);
    await this.routesService.ingest(routes, rapidTransitRoutes);

    // Translink returns data for routes that it doesn't have in the static data anymore,
    // so ensure these routes get created so the foreign key constraint doesn't fail
    await this.routesService.insertUnknownRoutes(
      uniquify(directions.map((d) => d.routeID))
    );

    await this.directionsService.ingest(directions);
    await this.shapesService.ingest(shapePoints);
    await this.servicesService.ingest(services, serviceExceptions);

    // This needs to be run after shapes and routes have been inserted,
    // since they need to be in the database for the trips and patterns to be generated
    const trips = await this.tripsService.generateTrips(
      tripObjects,
      patternObjects
    );

    await this.tripsService.ingest(trips);

    await this.stopTimesService.ingest(stopTimes);
  }

  private async parseRoutes(file: Buffer): Promise<{
    routes: Route[];
    rapidTransitRoutes: RapidTransitRoute[];
  }> {
    console.log("Parsing routes");

    const parsed = await this.parse(file);

    // Don't include HandyDart as a route
    const objects = convertToObjects(parsed, routeKeyTransformers).filter(
      (r) => r.id !== "HD"
    );

    const mapped = objects.map((o) =>
      isRapidTransitRoute(o) ? new RapidTransitRoute(o) : new Route(o)
    );

    return {
      routes: mapped.filter((r) => !(r instanceof RapidTransitRoute)),
      rapidTransitRoutes: mapped.filter(
        (r) => r instanceof RapidTransitRoute
      ) as RapidTransitRoute[],
    };
  }

  private async parseStops(file: Buffer) {
    console.log("Parsing stops");

    const parsed = await this.parse(file);

    const objects = convertToObjects(parsed, stopKeyTransformers);

    return objects.map((o) => new Stop(o));
  }

  private async parseTrips(file: Buffer): Promise<SimpleMap[]> {
    console.log("Parsing trips");

    const parsed = await this.parse(file);

    return convertToObjects(parsed, tripKeyTransformers).filter(
      (t) => t.route_id !== "HD"
    );
  }

  private async parseDirections(
    directionsFile: Buffer,
    exceptionsFile: Buffer
  ) {
    console.log("Parsing directions");

    const parsedDirections = await this.parse(directionsFile);
    const parsedExceptions = await this.parse(exceptionsFile);

    const directionObjects = convertToObjects(
      parsedDirections,
      directionKeyTransformers
    );
    const exceptionObjects = convertToObjects(
      parsedExceptions,
      directionExceptionKeyTransformers
    );

    const combined = directionObjects.map((d) => ({
      ...d,
      name:
        exceptionObjects.find(
          (e) =>
            e.direction_id === d.direction_id &&
            e.route_name === d.route_short_name
        )?.name || "",
    }));

    return combined.map((c) => new Direction(c));
  }

  private async parseShapes(file: Buffer) {
    console.log("Parsing shapes");

    const parsed = await this.parse(file);

    const shapePointObjects = convertToObjects(parsed, shapeKeyTransformers);

    return shapePointObjects.map((s) => new ShapePoint(s));
  }

  private async parseServices(servicesFile: Buffer, exceptionsFile: Buffer) {
    console.log("Parsing services");

    const parsedServices = await this.parse(servicesFile);
    const parsedExceptions = await this.parse(exceptionsFile);

    const servicesObjects = convertToObjects(
      parsedServices,
      serviceKeyTransformers
    ).filter((o) => o.id !== "HD");

    const exceptionObjects = uniquify(
      convertToObjects(parsedExceptions, serviceExceptionKeyTransformers),
      ["service_id", "date"]
    );

    return {
      services: servicesObjects.map((s) => new Service(s)),
      serviceExceptions: exceptionObjects.map((se) => new ServiceException(se)),
    };
  }

  private async parseStopTimes(file: Buffer) {
    console.log("Parsing stop times");

    const parsed = await this.parse(file);

    const stopTimeObjects = convertToObjects(parsed, stopTimeKeyTransformers);

    return stopTimeObjects.map((s) => new StopTime(s));
  }

  private async parsePatterns(file: Buffer): Promise<SimpleMap[]> {
    console.log("Parsing patterns");

    const parsed = await this.parse(file);

    const patternObjects = convertToObjects(parsed, patternKeyTransformers).map(
      (p) => {
        // `trip_id` is cursed from the CSV parse for some reason
        return Object.entries(p).reduce((acc, [key, val]) => {
          acc[key.trim()] = val;

          return acc;
        }, {} as SimpleMap);
      }
    );

    return patternObjects;
  }

  private async parse(file: Buffer): Promise<ParsedCSV> {
    return new Promise((resolve, reject) => {
      parse(file.toString("utf-8"), {}, (err, records) => {
        if (err) {
          return reject(err);
        }

        const parsed = processRecords(records);

        resolve(parsed);
      });
    });
  }
}

function getFile(files: AdmZip.IZipEntry[], filename: string): Buffer {
  return files.find((f) => f.name === filename)!.getData();
}
