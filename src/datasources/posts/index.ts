import DataLoader from "dataloader";

import {
  type Post,
  type PostWithUnresolvedRelations,
} from "../../types/index.js";
import { type PostsHttpClient } from "./http.js";

type Dependencies = {
  PostsClient: PostsHttpClient;
};

export class PostsDataSource {
  private PostsClient: PostsHttpClient;

  private loader: DataLoader<Post["authorId"], PostWithUnresolvedRelations[]>;

  constructor({ PostsClient }: Dependencies) {
    this.PostsClient = PostsClient;

    this.loader = new DataLoader(this.loadPostBatch.bind(this));
  }

  private async loadPostBatch(authorIds: Readonly<Array<Post["authorId"]>>) {
    const posts = await this.PostsClient.getPostsByAuthorIds([...authorIds]);

    const postsByAuthorId = authorIds.map((authorId) =>
      posts.filter((post) => post.authorId === authorId)
    );

    return postsByAuthorId;
  }

  getPosts() {
    return this.PostsClient.getPosts();
  }

  getPostsByAuthorId(authorId: Post["authorId"]) {
    return this.loader.load(authorId);
  }

  savePost(post: Post) {
    return this.PostsClient.savePost(post);
  }
}
