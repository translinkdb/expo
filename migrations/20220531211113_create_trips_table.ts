import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("blocks", (table) => {
    table.string("id").primary();
  });

  await knex.schema.createTable("route_patterns", (table) => {
    table.increments("id").primary();
    table.integer("route_id").references("routes.id");
    table.integer("pattern_id").references("patterns.id");

    table.unique(["route_id", "pattern_id"]);
  });

  await knex.schema.createTable("trips", (table) => {
    table.integer("id").primary();
    table.string("service_id").references("services.id");
    table.integer("route_pattern_id").references("route_patterns.id");
    table.string("block_id").references("blocks.id");
    table.string("headsign");
    table.integer("direction_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("trips");
  await knex.schema.dropTable("route_patterns");
  await knex.schema.dropTable("blocks");
}
