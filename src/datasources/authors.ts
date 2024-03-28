import DataLoader from "dataloader";
import { type Database } from "better-sqlite3";

import { type Author } from "../types/index.js";
import { logger } from "../logger/index.js";
import { database } from "./sql/sqlite.js";

const logSql = (sql: string) => logger.debug(`SQL: ${sql}`);

export class AuthorsDataSource {
  private database!: Database;

  private loader: DataLoader<Author["id"], Author>;

  constructor() {
    this.database = database;
    this.loader = new DataLoader(this.loadAuthorBatch.bind(this));
  }

  private async loadAuthorBatch(ids: Readonly<Array<Author["id"]>>) {
    const questionMarks = "?".repeat(ids.length).split("").join(",");

    const sql = `SELECT * FROM authors WHERE id in (${questionMarks})`;

    logSql(sql);

    return this.database.prepare(sql).all(ids) as Author[];
  }

  getAuthors() {
    const sql = "SELECT * FROM authors";

    logSql(sql);

    return this.database.prepare(sql).all() as Author[];
  }

  getAuthor(id: number) {
    return this.loader.load(id) as Promise<Author>;
  }

  createAuthor({ id, name }: Author) {
    const sql = "INSERT INTO authors (id, name) VALUES (?, ?)";

    logSql(sql);

    this.database.prepare(sql).run(id, name);

    return { id, name };
  }

  createAuthorsTable() {
    const sql = `CREATE TABLE IF NOT EXISTS authors (
      'id' INT PRIMARY KEY NOT NULL,
      'name' VARCHAR(255) NOT NULL
    );`;

    this.database.prepare(sql).run();
  }
}
