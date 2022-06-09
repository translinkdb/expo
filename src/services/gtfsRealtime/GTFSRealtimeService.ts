import { TranslinkGTFS } from "translinkjs";
import config from "../../../config";
import { Vehicle } from "../../db/entities/Vehicle";
import { VehiclesService } from "../db/VehiclesService";

export class GTFSRealtimeService {
  private translinkGTFS = new TranslinkGTFS(config.translinkAPIKey);
  private vehiclesService = new VehiclesService();

  public async vehiclePositions() {
    const vehiclePositions = await this.translinkGTFS.vehiclePositions();

    const vehicleIDs = vehiclePositions.map(
      (vp) => new Vehicle({ id: vp.vehicle.id })
    );

    if (vehicleIDs.length) {
      // Run this in the background
      this.vehiclesService.ensureVehiclesExist(vehicleIDs);
    }

    return vehiclePositions;
  }
}
