import { AuthorsDataSource } from "../datasources/authors.js";
import { PostsDataSource } from "../datasources/posts.js";
import { TagsDataSource } from "../datasources/tags.js";

export type Context = {
  dataSources: {
    authors: AuthorsDataSource;
    posts: PostsDataSource;
    tags: TagsDataSource;
  };
};
