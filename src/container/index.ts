import { asClass, asFunction, asValue, createContainer } from "awilix";

import { type GraphqlServer, makeGraphqlServer } from "../graphql/index.js";
import {
  type AuthorsSqlClient,
  makeAuthorsSqlClient,
} from "../datasources/authors/sql.js";
import {
  type PostsHttpClient,
  makePostsHttpClient,
} from "../datasources/posts/http.js";
import {
  type PostsJsonClient,
  makePostsJsonClient,
} from "../datasources/posts/json.js";
import {
  type TagsAvroClient,
  makeTagsAvroClient,
} from "../datasources/tags/avro.js";
import { AuthorsDataSource } from "../datasources/authors/index.js";
import { PostsDataSource } from "../datasources/posts/index.js";
import { TagsDataSource } from "../datasources/tags/index.js";
import { type Logger, logger } from "../logger/index.js";

type Dependencies = {
  graphqlServer: GraphqlServer;
  AuthorsClient: AuthorsSqlClient;
  PostsClient: PostsHttpClient;
  TagsClient: TagsAvroClient;
  PostsJsonClient: PostsJsonClient;
  AuthorsDataSource: AuthorsDataSource;
  PostsDataSource: PostsDataSource;
  TagsDataSource: TagsDataSource;
  authorsSqlPath: string;
  tagsAvroPath: string;
  postsJsonPath: string;
  postsHttpUrl: string;
  logger: Logger;
};

const awilixContainer = createContainer<Dependencies>();

awilixContainer.register({
  graphqlServer: asFunction(makeGraphqlServer).singleton(),
  AuthorsClient: asFunction(makeAuthorsSqlClient).singleton(),
  PostsClient: asFunction(makePostsHttpClient).singleton(),
  PostsJsonClient: asFunction(makePostsJsonClient).singleton(),
  TagsClient: asFunction(makeTagsAvroClient).singleton(),
  AuthorsDataSource: asClass(AuthorsDataSource).singleton(),
  PostsDataSource: asClass(PostsDataSource).singleton(),
  TagsDataSource: asClass(TagsDataSource).singleton(),
  authorsSqlPath: asValue(process.env.AUTHORS_FILE_PATH!),
  tagsAvroPath: asValue(process.env.TAGS_FILE_PATH!),
  postsJsonPath: asValue(process.env.POSTS_FILE_PATH!),
  postsHttpUrl: asValue(process.env.POSTS_HTTP_URL!),
  logger: asValue(logger),
});

export const container = awilixContainer.cradle;
