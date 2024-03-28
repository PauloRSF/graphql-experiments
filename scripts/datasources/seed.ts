import { Listr } from "listr2";
import _ from "lodash";

import { type Author } from "../../src/types/index.js";
import { authorFactory } from "../../src/factories/author.js";
import { sqlClient } from "../../src/datasources/sql/client.js";
import { httpDatasource } from "../../src/datasources/http/index.js";
import { fsDatasource } from "../../src/datasources/fs/index.js";
import { fsClient } from "../../src/datasources/fs/client.js";

type SeedTasksContext = {
  authors: Author[];
};

const tasks = new Listr<SeedTasksContext>(
  [
    {
      title: "Seed the 'posts' data source",
      task: async ({ authors }) => {
        await httpDatasource.start();

        const posts = authors
          .flatMap(({ posts }) => posts)
          .map(({ tags, author, ...post }) => ({
            ...post,
            author_id: author.id,
            tag_ids: tags.map(({ id }) => id),
          }));

        const postsCreationPromises = posts.map((post) =>
          fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post),
          })
        );

        await Promise.all(postsCreationPromises).then((res) =>
          res.forEach((r) => r.text().then((x) => console.log(x)))
        );

        httpDatasource.shutdown();
      },
    },
    {
      title: "Seed the 'authors' data source",
      task: async ({ authors }) => {
        authors
          .map(({ id, name }) => ({ id, name }))
          .forEach((values) => sqlClient.createAuthor(values));
      },
    },
    {
      title: "Seed the 'tags' data source",
      task: async ({ authors }) => {
        const posts = authors.flatMap(({ posts }) => posts);
        const tags = posts.flatMap(({ tags }) => tags);
        const uniqueTags = _.uniqBy(tags, "id");

        fsDatasource.setup();

        for (const tag of uniqueTags) {
          await fsClient.createTag(tag);
        }
      },
    },
  ],
  { concurrent: true }
);

await tasks.run({ authors: authorFactory.buildList(6) });
