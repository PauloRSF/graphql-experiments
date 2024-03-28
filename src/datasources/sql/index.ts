import { sqlClient } from "./client.js";

export type User = {
  id: number;
  name: string;
};

export const sqlDatasource = {
  setup: () => sqlClient.createAuthorsTable(),

  reset: () => sqlClient.deleteDatabase(),
};
