import { type Post, type PostWithSerializedAuthor } from "../posts/types.js";

export type User = {
  id: number;
  name: string;
  posts: Post[];
};

export type UserWithoutPosts = Omit<User, "posts">;

export type UserWithPostsWithSerializedAuthor = Omit<User, "posts"> & {
  posts: Array<PostWithSerializedAuthor>;
};
