import { parse } from "csv-parse";
import { readFile } from "fs/promises";
import path from "path";
import { ParsedCSV } from "../../structures/GTFSStatic/parser";
import {
  isRapidTransitRoute,
  RapidTransitRoute,
  Route,
} from "../../structures/GTFSStatic/routes";
import { Stop } from "../../structures/GTFSStatic/stops";
import { convertToObjects, processRecords } from "./helpers";
import { routeKeyTransformers, stopKeyTransformers } from "./transformers";

// Structure: https://developers.google.com/transit/gtfs/reference
export class GTFSStaticParser {
  public async parseRoutes(folderpath: string) {
    const filepath = path.join(folderpath, "routes.txt");

    const parsed = await this.parse(filepath);

    const objects = convertToObjects(parsed, routeKeyTransformers);

    return objects.map((o) =>
      isRapidTransitRoute(o) ? new RapidTransitRoute(o) : new Route(o)
    );
  }

  public async parseStops(folderpath: string) {
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
