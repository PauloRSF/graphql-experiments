import knex from "knex";

import { logger } from "../logger/index.js";

export const database = knex({
  client: "better-sqlite3",
  connection: { filename: "./data/users.db" },
  useNullAsDefault: true,
});

database.on("query", function ({ sql }) {
  logger.debug(`DATABASE: ${sql}`);
});

database.on("query-error", function (error) {
  logger.error(`DATABASE: ${error.message}`);
});
