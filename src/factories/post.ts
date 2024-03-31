import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import { type Author, type Post } from "../types/index.js";
import { TagFactory } from "./tag.js";

const tags = TagFactory.buildList(8);

export const PostFactory = Factory.define<Post>(({ sequence, params }) => {
  const postTags = Array(faker.number.int({ min: 1, max: 3 }))
    .fill(1)
    .map(() => {
      const randomIndex = faker.number.int({ min: 0, max: tags.length - 1 });
      return tags[randomIndex];
    });

  const author = params.author as Author;

  return {
    id: sequence,
    author,
    authorId: author.id,
    title: faker.lorem.sentence(),
    tagIds: postTags.map(({ id }) => id),
    tags: postTags,
  };
});
