import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import { type UserWithPostsWithSerializedAuthor } from "./types.js";
import { postWithSerializedAuthorFactory } from "../posts/factories.js";

export const userWithPostsWithSerializedAuthorFactory =
  Factory.define<UserWithPostsWithSerializedAuthor>(({ sequence }) => ({
    id: sequence,
    name: faker.person.fullName(),
    posts: postWithSerializedAuthorFactory.buildList(
      faker.number.int({ min: 1, max: 3 }),
      { author_id: sequence }
    ),
  }));
