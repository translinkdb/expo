import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("trips", (table) => {
    table.index("id", "trips_id_idx");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("trips", (table) => {
    table.dropIndex("id", "trips_id_idx");
  });
}
