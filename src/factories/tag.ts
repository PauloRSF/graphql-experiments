import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import { type Tag } from "../types/index.js";

export const tagFactory = Factory.define<Tag>(({ sequence }) => ({
  id: sequence,
  name: faker.lorem.word(),
}));
