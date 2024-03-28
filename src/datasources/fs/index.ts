import { jsonFileClient } from "./file.js";

export type Tag = {
  id: number;
  name: string;
};

export const fsDatasource = {
  setup: () => jsonFileClient.clearTags(),

  reset: () => jsonFileClient.deleteFile(),
};
