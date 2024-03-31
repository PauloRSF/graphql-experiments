import { type Post } from "../../types/index.js";
import { type EntityResolver } from "./index.js";

export type PostResolver = EntityResolver<Post>;

export const PostResolver: PostResolver = {
  type: {
    author: ({ authorId }, _, { dataSources }) =>
      dataSources.authors.getAuthor(authorId),
    tags: ({ tagIds }, _, { dataSources }) =>
      dataSources.tags.getTagsById(tagIds),
  },
};
