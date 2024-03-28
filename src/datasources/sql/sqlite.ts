import sqlite from "better-sqlite3";

export const authorsFilePath = process.env.AUTHORS_FILE_PATH ?? "authors.db";

export const database = sqlite(authorsFilePath);
