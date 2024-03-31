import sqlite from "better-sqlite3";

import { type Logger } from "../../logger/index.js";

type Author = {
  id: number;
  name: string;
};

type Dependencies = {
  authorsSqlPath: string;
  logger: Logger;
};

export const makeAuthorsSqlClient = ({
  authorsSqlPath,
  logger,
}: Dependencies) => {
  const database = sqlite(authorsSqlPath);

  const logSql = (sql: string) => logger.debug(`SQL: ${sql}`);

  return {
    setup: () => {
      const createTableSql = `CREATE TABLE IF NOT EXISTS authors (
        'id' INT PRIMARY KEY NOT NULL,
        'name' VARCHAR(255) NOT NULL
      )`;

      database.prepare(createTableSql).run();

      const deleteAuthorsSql = `DELETE FROM authors`;

      database.prepare(deleteAuthorsSql).run();
    },

    getAuthors: () => {
      const sql = "SELECT * FROM authors";

      logSql(sql);

      return database.prepare(sql).all() as Author[];
    },

    getAuthorsById: (ids: Array<Author["id"]>) => {
      const questionMarks = "?".repeat(ids.length).split("").join(",");

      const sql = `SELECT * FROM authors WHERE id in (${questionMarks})`;

      logSql(sql);

      return database.prepare(sql).all(ids) as Author[];
    },

    saveAuthor: ({ id, name }: Author) => {
      const sql = "INSERT INTO authors (id, name) VALUES (?, ?)";

      logSql(sql);

      database.prepare(sql).run(id, name);

      return { id, name };
    },
  };
};

export type AuthorsSqlClient = ReturnType<typeof makeAuthorsSqlClient>;
