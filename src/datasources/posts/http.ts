import { type Logger } from "../../logger/index.js";

type Post = {
  id: number;
  title: string;
  authorId: number;
  tagIds: number[];
};

type Dependencies = {
  postsHttpUrl: string;
  logger: Logger;
};

const fetchJson = async <T>(...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);

  if (!response.ok)
    throw new Error(`${response.status}: ${await response.text()}`);

  return response.json() as Promise<T>;
};

export const makePostsHttpClient = ({
  postsHttpUrl,
  logger,
}: Dependencies) => ({
  getPosts: () => {
    logger.debug(`HTTP: GET /posts`);

    return fetchJson<Post[]>(`${postsHttpUrl}/posts`);
  },

  getPostsByAuthorIds: (authorIds: Array<Post["authorId"]>) => {
    const queryString = authorIds.map((id) => `authorId=${id}`).join("&");

    logger.debug(`HTTP: GET /posts?${queryString}`);

    return fetchJson<Post[]>(`${postsHttpUrl}/posts?${queryString}`);
  },

  savePost: (post: Post) => {
    logger.debug(`HTTP: POST /posts`);

    return fetchJson<void>(`${postsHttpUrl}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
  },
});

export type PostsHttpClient = ReturnType<typeof makePostsHttpClient>;
