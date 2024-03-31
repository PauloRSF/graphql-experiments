import { type GraphQLFieldResolver } from "graphql";

import { type Context } from "../context.js";

export type EntityResolver<T> = {
  type: Partial<Record<keyof T, GraphQLFieldResolver<T, Context>>>;
  queries?: Record<string, GraphQLFieldResolver<T, Context>>;
};
