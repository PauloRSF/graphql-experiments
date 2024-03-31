import { type Author } from "../../types/index.js";
import { type EntityResolver } from "./index.js";

export type AuthorResolver = EntityResolver<Author>;

export const AuthorResolver: AuthorResolver = {
  type: {
    posts: ({ id: authorId }, _, { dataSources }) => {
      return dataSources.posts.getPostsByAuthorId(authorId);
    },
  },
  queries: {
    authors: (_1, _2, { dataSources }) => dataSources.authors.getAuthors(),
  },
};
