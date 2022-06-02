import { GTFSStaticService } from "../../services/gtfsStatic/GTFSStaticService";

export async function ingestGTFSStaticDataResolver() {
  const staticService = new GTFSStaticService();

  await staticService.refreshStaticData({ year: 2022, month: 5, day: 27 });
}
