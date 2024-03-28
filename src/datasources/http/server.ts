import fastify from "fastify";

import { logger } from "../../logger/index.js";
import { avroFileClient } from "./avro.js";
import {
  validatePostCreationBody,
  validatePostListQuery,
} from "./validations.js";
import { Post } from "./index.js";

export const server = fastify();

server.addHook("onRequest", (request, _, done) => {
  logger.debug(
    `HTTP: ${request.method} ${request.url} [ID: ${request.id}] [Remote: ${request.socket.remoteAddress}:${request.socket.remotePort}]`
  );

  done();
});

server.get("/posts", async (request) => {
  const allPosts = await avroFileClient.readPosts();

  const { authorIds } = validatePostListQuery(request.query);

  const posts = authorIds
    ? allPosts.filter((post: Post) => authorIds.includes(post.author_id))
    : allPosts;

  return {
    total: posts.length,
    posts,
  };
});

server.post("/posts", async (request, response) => {
  const newPostResult = validatePostCreationBody(request.body);

  if (newPostResult.kind === "error")
    return response
      .status(422)
      .send({ error: { message: newPostResult.message } });

  await avroFileClient.savePost(newPostResult.data);

  response.status(201).send({ post: newPostResult.data });
});

export const httpServer = {
  start: async () => {
    const url = await server.listen({ port: 3000 });

    logger.info(`HTTP: Listening on ${url}`);
  },

  shutdown: () => server.close(),
};
