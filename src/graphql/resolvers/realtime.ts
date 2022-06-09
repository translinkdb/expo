import { RealtimeCachingService } from "../../services/gtfsRealtime/RealtimeCachingService";
import { TripsService } from "../../services/db/TripsService";
import { GTFSRealtimeService } from "../../services/gtfsRealtime/GTFSRealtimeService";
import { VehiclePosition } from "../../structures/GTFSRealtime/VehiclePosition";

export async function vehiclePositionsResolver(
  _parent: any,
  {
    forceRefetch,
  }: {
    forceRefetch?: boolean;
  }
): Promise<VehiclePosition[]> {
  const gtfsRealtimeService = new GTFSRealtimeService();
  const realtimeCachingService = new RealtimeCachingService();
  const tripsService = new TripsService();

  let positions: VehiclePosition[];

  if (
    forceRefetch ||
    (await realtimeCachingService.shouldRefetchVehiclePositions())
  ) {
    console.log("Fetching vehicle positions");

    const vehiclePositions = (await gtfsRealtimeService.vehiclePositions()).map(
      (vp) => VehiclePosition.fromTranslinkJS(vp)
    );

    if (vehiclePositions.length) {
      await realtimeCachingService.storeVehiclePositions(vehiclePositions);
    }

    positions = vehiclePositions;
  } else {
    console.log("Using stored vehicle positions");

    positions = await realtimeCachingService.getStoredVehiclePositions();
  }

  return await tripsService.attachToVehiclePositions(positions);
}
