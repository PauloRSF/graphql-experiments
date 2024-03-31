import _ from "lodash";
import { Listr } from "listr2";
import promiseRetry from "promise-retry";

import { type Author } from "../../src/types/index.js";
import { AuthorFactory } from "../../src/factories/author.js";
import { makeAuthorsSqlClient } from "../../src/datasources/authors/sql.js";
import { makePostsJsonClient } from "../../src/datasources/posts/json.js";
import { makePostsHttpClient } from "../../src/datasources/posts/http.js";
import { makeTagsAvroClient } from "../../src/datasources/tags/avro.js";
import { logger } from "../../src/logger/index.js";

const TagsAvroClient = makeTagsAvroClient({
  tagsAvroPath: process.env.TAGS_FILE_PATH!,
  logger,
});

const PostsJsonClient = makePostsJsonClient({
  postsJsonPath: process.env.POSTS_FILE_PATH!,
});

const PostsHttpClient = makePostsHttpClient({
  postsHttpUrl: process.env.POSTS_HTTP_URL!,
  logger,
});

const AuthorsSqlClient = makeAuthorsSqlClient({
  authorsSqlPath: process.env.AUTHORS_FILE_PATH!,
  logger,
});

type SeedTasksContext = {
  authors: Author[];
};

const tasks = new Listr<SeedTasksContext>([
  {
    title: "Setup the datasources",
    task: async (_, task) =>
      task.newListr(
        [
          {
            title: "Setup the 'posts' data source",
            task: () => PostsJsonClient.setup(),
          },
          {
            title: "Setup the 'authors' data source",
            task: () => AuthorsSqlClient.setup(),
          },
          {
            title: "Setup the 'tags' data source",
            task: () => TagsAvroClient.setup(),
          },
        ],
        { concurrent: true }
      ),
  },
  {
    title: "Wait for HTTP server to be healthy",
    task: () =>
      promiseRetry((retry) => PostsHttpClient.getPosts().catch(retry)),
  },
  {
    title: "Seed the datasources",
    task: async (_, task) =>
      task.newListr(
        [
          {
            title: "Seed the 'posts' data source",
            task: async ({ authors }) => {
              const posts = authors
                .flatMap(({ posts }) => posts)
                .map(({ tags, author, ...post }) => ({
                  ...post,
                  authorId: author.id,
                  tagIds: tags.map(({ id }) => id),
                }));

              return Promise.all(
                posts.map((post) => PostsHttpClient.savePost(post))
              );
            },
          },
          {
            title: "Seed the 'authors' data source",
            task: async ({ authors }) =>
              Promise.all(
                authors.map((author) => AuthorsSqlClient.saveAuthor(author))
              ),
          },
          {
            title: "Seed the 'tags' data source",
            task: async ({ authors }) => {
              const tags = authors.flatMap(({ posts }) =>
                posts.flatMap(({ tags }) => tags)
              );

              return Promise.all(
                tags.map((tag) => TagsAvroClient.saveTag(tag))
              );
            },
          },
        ],
        { concurrent: true }
      ),
  },
]);

await tasks.run({ authors: AuthorFactory.buildList(6) });
