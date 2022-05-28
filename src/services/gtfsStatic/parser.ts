import { parse } from "csv-parse";
import { readFile } from "fs/promises";
import path from "path";
import { ParsedCSV } from "../../structures/GTFSStatic/parser";
import {
  isRapidTransitRoute,
  RapidTransitRoute,
  Route,
} from "../../db/entities/Route";
import { Stop } from "../../db/entities/Stop";
import { convertToObjects, processRecords } from "./helpers";
import { routeKeyTransformers, stopKeyTransformers } from "./transformers";
import { RoutesService } from "../db/RoutesService";
import { StopsService } from "../db/StopsService";

// Structure: https://developers.google.com/transit/gtfs/reference
export class GTFSStaticParser {
  private stopsService = new StopsService();
  private routesService = new RoutesService();

  public async ingestAll(folderpath: string) {
    const { routes, rapidTransitRoutes } = await this.parseRoutes(folderpath);
    const stops = await this.parseStops(folderpath);

    await this.stopsService.ingest(stops);
    await this.routesService.ingest(routes, rapidTransitRoutes);
  }

  private async parseRoutes(folderpath: string): Promise<{
    routes: Route[];
    rapidTransitRoutes: RapidTransitRoute[];
  }> {
    const filepath = path.join(folderpath, "routes.txt");

    const parsed = await this.parse(filepath);

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

  private async parseStops(folderpath: string) {
    const filepath = path.join(folderpath, "stops.txt");

    const parsed = await this.parse(filepath);

    const objects = convertToObjects(parsed, stopKeyTransformers);

    return objects.map((o) => new Stop(o));
  }

  private async parse(filepath: string): Promise<ParsedCSV> {
    const file = await readFile(filepath);

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
