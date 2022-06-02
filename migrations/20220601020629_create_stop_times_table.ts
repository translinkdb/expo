import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("stop_times", (table) => {
    table.integer("trip_id").references("trips.id");
    table.integer("stop_id").references("stops.id");
    table.time("arrival");
    table.time("departure");
    table.integer("order");
    table.boolean("is_pickup_restricted");
    table.boolean("is_dropoff_restricted");
    table.float("cumulative_distance");

    table.primary(["trip_id", "order"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("stop_times");
}
