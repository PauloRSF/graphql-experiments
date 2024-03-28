import { avroFileClient } from "./avro.js";

export type Post = {
  id: number;
  title: string;
  author_id: number;
  tag_ids: number[];
};

export const httpDatasource = {
  setup: () => avroFileClient.clearPosts(),

  reset: () => avroFileClient.deleteFile(),
};
