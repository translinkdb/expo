import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("routes", (table) => {
    createRouteTable(table);
  });

  await knex.schema.createTable("rapid_transit_routes", (table) => {
    createRouteTable(table);

    table.string("color");
    table.string("text_color");
    table.integer("type");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("routes");
  await knex.schema.dropTable("rapid_transit_routes");
}

// Helpers

function createRouteTable(table: Knex.CreateTableBuilder) {
  table.bigInteger("id").primary();
  table.string("number", 32);
  table.string("name");
}
