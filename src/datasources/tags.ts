import { readFile, writeFile } from "fs/promises";

import DataLoader from "dataloader";

import { type Tag } from "../types/index.js";
import { logger } from "../logger/index.js";
import { Writable } from "stream";
import { promisify } from "util";

export class TagsDataSource {
  path!: string;

  private loader: DataLoader<Tag["id"], Tag>;

  private tagWriterStream: Writable;

  constructor() {
    this.path = process.env.TAGS_FILE_PATH ?? "tags.json";

    this.loader = new DataLoader(this.loadTagBatch.bind(this));

    const self = this;

    this.tagWriterStream = new Writable({
      objectMode: true,
      write(tag: Tag, _, callback) {
        self.readTags().then((tags) => {
          tags.push(tag);

          logger.debug(`FS: Write ${self.path}`);

          writeFile(self.path, JSON.stringify(tags, undefined, 2))
            .then(() => callback())
            .catch((error) => callback(error));
        });
      },
    });
  }

  private async loadTagBatch(ids: Readonly<Array<Tag["id"]>>) {
    const tags = await this.readTags();

    return tags.filter(({ id }: Tag) => ids.includes(id));
  }

  private async readTags() {
    logger.debug(`FS: Read ${this.path}`);

    const tagsJsonString = await readFile(this.path, "utf-8");

    return JSON.parse(tagsJsonString) as Tag[];
  }

  private async saveTag(tag: Tag) {
    const writeTag = promisify<Tag, void>(
      this.tagWriterStream.write.bind(this.tagWriterStream)
    );

    await writeTag(tag);
  }

  getTags() {
    return this.readTags();
  }

  async getTagsById(ids: Array<Tag["id"]>) {
    return this.loader.loadMany(ids);
  }

  async createTag(tag: Tag) {
    const tags = await this.readTags();

    const newTag = {
      id: tag.id,
      name: tag.name,
    };

    const tagAlreadyExists = tags.some(({ name }) => name === tag.name);

    if (!tagAlreadyExists) await this.saveTag(newTag);

    return newTag;
  }
}
