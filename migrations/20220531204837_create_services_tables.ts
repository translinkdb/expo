import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("services", (table) => {
    table.integer("id").primary();
    table.boolean("monday");
    table.boolean("tuesday");
    table.boolean("wednesday");
    table.boolean("thursday");
    table.boolean("friday");
    table.boolean("saturday");
    table.boolean("sunday");
    table.date("start_date");
    table.date("end_date");
    table.string("name").nullable();
  });

  await knex.schema.createTable("service_exceptions", (table) => {
    table.integer("service_id").references("services.id");
    table.date("date");
    table.integer("type");

    table.primary(["service_id", "date"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("service_exceptions");
  await knex.schema.dropTable("services");
}
