import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("shapes", (table) => {
    table.integer("id").primary();
  });

  await knex.schema.createTable("shape_points", (table) => {
    table.integer("shape_id").references("shapes.id");
    table.float("latitude");
    table.float("longitude");
    table.integer("order");
    table.float("cumulative_distance");

    table.primary(["shape_id", "order"]);
  });

  await knex.schema.createTable("patterns", (table) => {
    table.integer("id").primary();
    table.string("name");
    table.integer("shape_id").references("shapes.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("patterns");
  await knex.schema.dropTable("shape_points");
  await knex.schema.dropTable("shapes");
}
