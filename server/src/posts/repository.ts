import { database } from "../database/index.js";
import { type PostWithoutAuthor } from "./types.js";

type FindPostsOptions = Partial<{
  authorId: number;
}>;

type PostRepository = {
  find: (options: FindPostsOptions) => Promise<PostWithoutAuthor[]>;
};

export const postRepository: PostRepository = {
  find: async ({ authorId }) => {
    if (authorId === 1) {
      return [
        {
          id: 1,
          title: "Fulano's post",
        },
        {
          id: 2,
          title: "Fulano's other post",
        },
      ];
    }

    return [];
  },
};
