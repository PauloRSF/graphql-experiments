import { writeFile, mkdir } from "fs/promises";

import { Listr } from "listr2";

import { userWithPostsWithSerializedAuthorFactory } from "./users/factories.js";
import { UserWithPostsWithSerializedAuthor } from "./users/types.js";
import { database } from "./database/index.js";

type SeedTasksContext = {
  users: UserWithPostsWithSerializedAuthor[];
};

const tasks = new Listr<SeedTasksContext>([
  {
    title: "Seed the 'posts' data source",
    task: async ({ users }) => {
      const posts = users.flatMap(({ posts }) => posts);

      await writeFile("./data/posts.json", JSON.stringify(posts, undefined, 2));
    },
  },
  {
    title: "Seed the 'users' data source",
    task: async ({ users }) => {
      const usersValues = users.map(({ id, name }) => ({ id, name }));

      await database.insert(usersValues).into("users");
    },
  },
]);

await mkdir("./data", { recursive: true });

await tasks.run({
  users: userWithPostsWithSerializedAuthorFactory.buildList(6),
});
