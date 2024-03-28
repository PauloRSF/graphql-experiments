import { type GraphQLFieldResolver } from "graphql";

import { type Post } from "../types/index.js";
import { Context } from "../graphql/context.js";

export const postTypeResolver: Record<
  string,
  GraphQLFieldResolver<Post, Context>
> = {
  author: async ({ authorId }, _, { dataSources }) =>
    dataSources.authors.getAuthor(authorId),
  tags: async ({ tagIds }, _, { dataSources }) =>
    dataSources.tags.getTagsById(tagIds),
};
