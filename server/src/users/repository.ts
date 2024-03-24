import { database } from "../database/index.js";
import { type UserWithoutPosts } from "./types.js";

type UserRepository = {
  all: () => Promise<UserWithoutPosts[]>;
};

export const userRepository: UserRepository = {
  all: () => database.select().from("users"),
};
