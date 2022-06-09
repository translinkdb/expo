import { db } from "../../db";
import { Vehicle } from "../../db/entities/Vehicle";

export class VehiclesService {
  public async ensureVehiclesExist(vehicles: Vehicle[]) {
    await db
      .insert(vehicles.map((v) => v.asInsertable()))
      .into("vehicles")
      .onConflict("id")
      .ignore();
  }
}
