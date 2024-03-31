export type Tag = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  title: string;
  authorId: Author["id"];
  author: Author;
  tagIds: Array<Tag["id"]>;
  tags: Tag[];
};

export type PostWithUnresolvedRelations = Omit<Post, "author" | "tags">;

export type Author = {
  id: number;
  name: string;
  posts: Post[];
};

export type AuthorWithUnresolvedRelations = Omit<Author, "posts">;
