import DataLoader from "dataloader";

import { type Post, type PostWithUnresolvedRelations } from "../types/index.js";

type SerializedPost = {
  id: number;
  title: string;
  author_id: number;
  tag_ids: number[];
};

type GetPostsResponse = {
  total: number;
  posts: SerializedPost[];
};

type CreatePostResponse = {
  post: SerializedPost;
};

const fetchJson = <T>(...args: Parameters<typeof fetch>) =>
  fetch(...args).then((response) => response.json() as Promise<T>);

const deserializePost = (
  serializedPost: SerializedPost
): PostWithUnresolvedRelations => ({
  id: serializedPost.id,
  title: serializedPost.title,
  authorId: serializedPost.author_id,
  tagIds: serializedPost.tag_ids,
});

export class PostsDataSource {
  url: string;

  private loader: DataLoader<Post["authorId"], PostWithUnresolvedRelations[][]>;

  constructor() {
    this.url = "http://localhost:3000";
    this.loader = new DataLoader(this.loadPostBatch.bind(this));
  }

  private async loadPostBatch(authorIds: Readonly<Array<Post["authorId"]>>) {
    const { posts: serializedPosts } = await fetchJson<GetPostsResponse>(
      `http://localhost:3000/posts?author_ids=${authorIds}`
    );

    const posts = serializedPosts.map(deserializePost);

    const postsByAuthorId = authorIds.map((authorId) =>
      posts.filter((post) => post.authorId === authorId)
    );

    return postsByAuthorId;
  }

  async getPosts() {
    const { total, posts } = await fetchJson<GetPostsResponse>(
      "http://localhost:3000/posts"
    );

    return { total, posts: posts.map(deserializePost) };
  }

  async getPostsByAuthorId(authorId: number) {
    const posts = await this.loader.load(authorId);

    return { total: posts.length, posts };
  }

  createPost(post: { id: number; title: string; author_id: number }) {
    return fetchJson<CreatePostResponse>("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
  }
}
