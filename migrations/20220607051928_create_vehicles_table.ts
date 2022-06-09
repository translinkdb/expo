import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("vehicles", (table) => {
    table.integer("id").primary();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("vehicles");
}
