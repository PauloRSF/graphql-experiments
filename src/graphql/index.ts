import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { logger } from "../logger/index.js";
import { type Context } from "./context.js";
import {
  authorTypeResolver,
  authorsQueryResolver,
} from "../resolvers/authors.js";
import { postTypeResolver } from "../resolvers/posts.js";
import { AuthorsDataSource } from "../datasources/authors.js";
import { PostsDataSource } from "../datasources/posts.js";
import { TagsDataSource } from "../datasources/tags.js";

const typeDefs = `#graphql
  type Tag {
    id: ID
    name: String
  }

  type Post {
    id: ID
    title: String
    author: Author
    tags: [Tag]
  }

  type Author {
    id: ID
    name: String
    posts: [Post]
  }

  type Query {
    authors: [Author]
  }
`;

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers: {
    Query: {
      authors: authorsQueryResolver,
    },
    Author: authorTypeResolver,
    Post: postTypeResolver,
  },
});

export const graphql = {
  start: async () => {
    const { url } = await startStandaloneServer(server, {
      context: async () => ({
        dataSources: {
          authors: new AuthorsDataSource(),
          posts: new PostsDataSource(),
          tags: new TagsDataSource(),
        },
      }),
    });

    logger.info(`GRAPHQL: Listening in ${url}`);
  },
};
