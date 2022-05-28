import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("routes", (table) => {
    createRouteTable(table);
  });

  await knex.schema.createTable("rapid_transit_routes", (table) => {
    createRouteTable(table);

    table.string("color");
    table.string("text_colour");
    table.integer("type");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("routes");
}

// Helpers

function createRouteTable(table: Knex.CreateTableBuilder) {
  table.bigInteger("id").primary();
  table.string("number", 32);
  table.string("name");
}
