import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { userTypeResolver, usersQueryResolver } from "../users/resolvers.js";
import { logger } from "../logger/index.js";

const typeDefs = `#graphql
  type Post {
    id: ID
    title: String
    author: User
  }

  type User {
    id: ID
    name: String
    posts: [Post]
  }

  type Query {
    users: [User]
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      users: usersQueryResolver,
    },
    User: userTypeResolver,
  },
});

export const graphql = {
  start: async () => {
    const { url } = await startStandaloneServer(server);

    logger.info(`SERVER: Listening in ${url}`);
  },
};
