import { type GraphQLFieldResolver } from "graphql";

import { type Author } from "../types/index.js";
import { type Context } from "../graphql/context.js";

export const authorsQueryResolver: GraphQLFieldResolver<Author, Context> = (
  _1,
  _2,
  { dataSources }
) => dataSources.authors.getAuthors();

export const authorTypeResolver: Record<
  string,
  GraphQLFieldResolver<Author, Context>
> = {
  posts: async ({ id: authorId }, _, { dataSources }) => {
    const { posts } = await dataSources.posts.getPostsByAuthorId(authorId);

    return posts;
  },
};
