import { promisify } from "node:util";
import { Writable } from "node:stream";
import { readFile, writeFile } from "node:fs/promises";

import avro from "avsc";

import { type Logger } from "../../logger/index.js";

type Tag = {
  id: number;
  name: string;
};

const tagsType = avro.Type.forSchema({
  type: "array",
  items: {
    type: "record",
    name: "Tag",
    fields: [
      {
        name: "id",
        type: "int",
      },
      { name: "name", type: "string" },
    ],
  },
});

type Dependencies = {
  tagsAvroPath: string;
  logger: Logger;
};

export const makeTagsAvroClient = ({ tagsAvroPath, logger }: Dependencies) => {
  const readTags = async () => {
    logger.debug(`FS: Read ${tagsAvroPath}`);

    const tagsBuffer = await readFile(tagsAvroPath);

    return tagsType.fromBuffer(tagsBuffer) as Tag[];
  };

  const tagWriterStream = new Writable({
    objectMode: true,
    write(tag: Tag, _, callback) {
      readTags().then((tags) => {
        tags.push(tag);

        logger.debug(`FS: Write ${tagsAvroPath}`);

        writeFile(tagsAvroPath, tagsType.toBuffer(tags))
          .then(() => callback())
          .catch((error) => callback(error));
      });
    },
  });

  return {
    setup: () =>
      writeFile(tagsAvroPath, tagsType.toBuffer([])).then(() => undefined),
    readTags,
    saveTag: async (tag: Tag) => {
      const writeTag = promisify<Tag, void>(
        tagWriterStream.write.bind(tagWriterStream)
      );

      await writeTag(tag);
    },
  };
};
export type TagsAvroClient = ReturnType<typeof makeTagsAvroClient>;
