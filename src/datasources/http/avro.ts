import { promisify } from "node:util";
import { Writable } from "node:stream";
import { readFile, rm, writeFile } from "fs/promises";

import avro from "avsc";

import { Post } from "./index.js";

export const postsFilePath = process.env.POSTS_FILE_PATH ?? "posts.avro";

const postsType = avro.Type.forSchema({
  type: "array",
  items: {
    type: "record",
    name: "Post",
    fields: [
      {
        name: "id",
        type: "int",
      },
      { name: "title", type: "string" },
      { name: "author_id", type: "int" },
      {
        name: "tag_ids",
        type: {
          type: "array",
          items: "int",
        },
      },
    ],
  },
});

const readPosts = async () => {
  const postsBuffer = await readFile(postsFilePath);

  return postsType.fromBuffer(postsBuffer) as Post[];
};

const postWriterStream = new Writable({
  objectMode: true,
  write(post: Post, _, callback) {
    readPosts().then((posts) => {
      posts.push(post);

      writeFile(postsFilePath, postsType.toBuffer(posts))
        .then(() => callback())
        .catch((error) => callback(error));
    });
  },
});

export const avroFileClient = {
  deleteFile: () => rm(postsFilePath, { force: true }),
  readPosts,
  clearPosts: () =>
    writeFile(postsFilePath, postsType.toBuffer([])).then(() => undefined),
  savePost: promisify<Post, void>(
    postWriterStream.write.bind(postWriterStream)
  ),
};
