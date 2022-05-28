import knex from "knex";
import config from "../../config";

export const db = knex({
  client: "pg",
  connection: config.database,
});

db.on("query", (data) => console.log(data.sql));
