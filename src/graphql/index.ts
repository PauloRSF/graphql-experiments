import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { type Context } from "./context.js";
import { type Logger } from "../logger/index.js";
import { type AuthorsDataSource } from "../datasources/authors/index.js";
import { type PostsDataSource } from "../datasources/posts/index.js";
import { type TagsDataSource } from "../datasources/tags/index.js";
import { AuthorResolver } from "./resolvers/authors.js";
import { PostResolver } from "./resolvers/posts.js";

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

type Dependencies = {
  AuthorsDataSource: AuthorsDataSource;
  PostsDataSource: PostsDataSource;
  TagsDataSource: TagsDataSource;
  logger: Logger;
};

export const makeGraphqlServer = ({
  AuthorsDataSource,
  PostsDataSource,
  TagsDataSource,
  logger,
}: Dependencies) => {
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers: {
      Query: {
        ...AuthorResolver.queries,
      },
      Author: AuthorResolver.type,
      Post: PostResolver.type,
    },
  });

  return {
    start: async () => {
      const { url } = await startStandaloneServer(server, {
        context: async () => ({
          dataSources: {
            authors: AuthorsDataSource,
            posts: PostsDataSource,
            tags: TagsDataSource,
          },
        }),
      });

      logger.info(`GRAPHQL: Listening in ${url}`);
    },
  };
};

export type GraphqlServer = ReturnType<typeof makeGraphqlServer>;
