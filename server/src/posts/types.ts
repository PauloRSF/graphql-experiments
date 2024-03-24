import { type User } from "../users/types.js";

export type Post = {
  id: number;
  title: string;
  author: User;
};

export type PostWithoutAuthor = Omit<Post, "author">;

export type PostWithSerializedAuthor = Omit<Post, "author"> & {
  author_id: User["id"];
};
