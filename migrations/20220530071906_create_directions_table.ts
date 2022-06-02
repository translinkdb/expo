import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("directions", (table) => {
    table.integer("direction_id");
    table.string("cardinal_direction", 5);
    table.integer("route_id").references("routes.id").nullable();
    table.string("name");

    table.primary(["direction_id", "route_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("directions");
}
