import { toInt } from "../../helpers/typeConverters";
import { redisClient } from "../../redis/client";
import { VehiclePosition } from "../../structures/GTFSRealtime/VehiclePosition";

export class RealtimeCachingService {
  public readonly refetchThreshold = 30 * 1000;

  async shouldRefetchVehiclePositions(): Promise<boolean> {
    const fetchedAt = await redisClient.get("expo-vp-fetchedat");

    if (!fetchedAt) return true;

    return new Date().getTime() > toInt(fetchedAt)! + this.refetchThreshold;
  }

  async getStoredVehiclePositions(): Promise<VehiclePosition[]> {
    const stored = await redisClient.lRange("expo-vehicle-positions", 0, -1);

    return stored.map((s) => VehiclePosition.fromJSON(s));
  }

  async storeVehiclePositions(vehiclePositions: VehiclePosition[]) {
    await this.flushStoredVehiclePositions();

    const storedAt = new Date();
    await redisClient.set("expo-vp-fetchedat", storedAt.getTime());

    await redisClient.lPush(
      "expo-vehicle-positions",
      vehiclePositions.map((vp) => vp.asJSON())
    );
  }

  private async flushStoredVehiclePositions() {
    await redisClient.lTrim("expo-vehicle-positions", 0, 0);
  }
}
