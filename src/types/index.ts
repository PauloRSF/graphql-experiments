export type Tag = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  title: string;
  authorId: Author["id"];
  author: AuthorWithoutPosts;
  tagIds: Array<Tag["id"]>;
  tags: Tag[];
};

export type PostWithUnresolvedRelations = Omit<Post, "author" | "tags">;

export type Author = {
  id: number;
  name: string;
  posts: Post[];
};

export type AuthorWithoutPosts = Omit<Author, "posts">;
