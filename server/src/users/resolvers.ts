import { postRepository } from "../posts/repository.js";
import { userRepository } from "./repository.js";
import { type User } from "./types.js";

export const usersQueryResolver = () => userRepository.all();

export const userTypeResolver = {
  posts: ({ id }: User) => postRepository.find({ authorId: id }),
};
