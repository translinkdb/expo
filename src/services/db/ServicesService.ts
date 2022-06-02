import { db } from "../../db";
import { Service, ServiceException } from "../../db/entities/Service";

export class ServicesService {
  public async ingest(services: Service[], exceptions: ServiceException[]) {
    await db
      .insert(services.map((s) => s.asInsertable()))
      .into("services")
      .onConflict("id")
      .merge();

    await db
      .insert(exceptions.map((e) => e.asInsertable()))
      .into("service_exceptions")
      .onConflict(["service_id", "date"])
      .merge();
  }
}
