import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import { postFactory } from "./post.js";
import { type Author } from "../types/index.js";

export const authorFactory = Factory.define<Author>(({ sequence }) => {
  const authorWithoutPosts = {
    id: sequence,
    name: faker.person.fullName(),
  };

  return {
    ...authorWithoutPosts,
    posts: postFactory.buildList(faker.number.int({ min: 1, max: 3 }), {
      author: authorWithoutPosts,
    }),
  };
});
