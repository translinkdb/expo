import type { Knex } from "knex";
import expoConfig from "./config";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: expoConfig.database,
    migrations: {
      extension: "ts",
    },
  },
};

module.exports = config;
