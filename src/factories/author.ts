import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import { PostFactory } from "./post.js";
import { type Author } from "../types/index.js";

export const AuthorFactory = Factory.define<Author>(({ sequence }) => {
  const authorWithoutPosts = {
    id: sequence,
    name: faker.person.fullName(),
  };

  return {
    ...authorWithoutPosts,
    posts: PostFactory.buildList(faker.number.int({ min: 1, max: 3 }), {
      author: authorWithoutPosts,
    }),
  };
});
