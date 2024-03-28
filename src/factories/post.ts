import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import { type Author, type Post } from "../types/index.js";
import { tagFactory } from "./tag.js";

const tags = tagFactory.buildList(8);

export const postFactory = Factory.define<Post>(({ sequence, params }) => {
  const postTags = Array(faker.number.int({ min: 1, max: 3 }))
    .fill(1)
    .map(() => {
      const randomIndex = faker.number.int({ min: 0, max: tags.length - 1 });
      return tags[randomIndex];
    });

  return {
    id: sequence,
    author: params.author as Author,
    title: faker.lorem.sentence(),
    tagIds: postTags.map(({ id }) => id),
    tags: postTags,
  };
});
