import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("stops", (table) => {
    table.bigInteger("id").primary();
    table.string("code", 10);
    table.string("name");
    table.float("latitude");
    table.float("longitude");
    table.string("zone");
    table.bigInteger("parent_stop_id").references("id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("stops");
}
