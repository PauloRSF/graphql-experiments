import { type AuthorsDataSource } from "../datasources/authors/index.js";
import { type PostsDataSource } from "../datasources/posts/index.js";
import { type TagsDataSource } from "../datasources/tags/index.js";

export type Context = {
  dataSources: {
    authors: AuthorsDataSource;
    posts: PostsDataSource;
    tags: TagsDataSource;
  };
};
