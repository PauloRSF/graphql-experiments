import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import { type PostWithSerializedAuthor } from "./types.js";

export const postWithSerializedAuthorFactory =
  Factory.define<PostWithSerializedAuthor>(({ sequence, params }) => ({
    id: sequence,
    author_id: params.author_id ?? faker.number.int({ min: 1 }),
    title: faker.lorem.sentence(),
  }));
