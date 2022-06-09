import {
  GTFSStaticService,
  SimpleDate,
} from "../../services/gtfsStatic/GTFSStaticService";

export async function ingestGTFSStaticDataResolver(
  _parent: any,
  { date }: { date: SimpleDate }
) {
  const staticService = new GTFSStaticService();

  await staticService.refreshStaticData(date);
}
