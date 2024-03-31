import { writeFile } from "node:fs/promises";

type Dependencies = {
  postsJsonPath: string;
};

export const makePostsJsonClient = ({ postsJsonPath }: Dependencies) => ({
  setup: async () => {
    await writeFile(postsJsonPath, JSON.stringify({ posts: [] }));
  },
});

export type PostsJsonClient = ReturnType<typeof makePostsJsonClient>;
