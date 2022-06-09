import { zeroPrefix } from "../../helpers/numbers";
import fetch from "node-fetch";
import AdmZip from "adm-zip";
import { GTFSStaticParser } from "./parser";

export type SimpleDate = {
  year: number;
  month: number;
  day: number;
};

export class GTFSStaticService {
  private parser = new GTFSStaticParser();

  public async refreshStaticData(date: SimpleDate) {
    const data = await this.fetchData(date);

    const files = await this.splitIntoFiles(data);

    console.log(files.map((f) => f.name));

    await this.parser.ingestAll(files);
  }

  private async fetchData({ year, month, day }: SimpleDate): Promise<Buffer> {
    const url = `https://gtfs-static.translink.ca/gtfs/History/${year}-${zeroPrefix(
      month
    )}-${zeroPrefix(day)}/google_transit.zip`;

    console.log("Fetching GTFS static information...");
    const response = await fetch(url);

    return await response.buffer();
  }

  private async splitIntoFiles(buffer: Buffer) {
    const zip = new AdmZip(buffer);

    return zip.getEntries();
  }
}
