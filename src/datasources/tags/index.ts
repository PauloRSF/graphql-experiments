import DataLoader from "dataloader";

import { type Tag } from "../../types/index.js";
import { type TagsAvroClient } from "./avro.js";

type Dependencies = {
  TagsClient: TagsAvroClient;
};

export class TagsDataSource {
  private TagsClient: TagsAvroClient;

  private loader: DataLoader<Tag["id"], Tag>;

  constructor({ TagsClient }: Dependencies) {
    this.TagsClient = TagsClient;

    this.loader = new DataLoader(this.loadTagBatch.bind(this));
  }

  private async loadTagBatch(ids: Readonly<Array<Tag["id"]>>) {
    const tags = await this.TagsClient.readTags();

    return ids.map((id) => {
      const tag = tags.find((tag) => tag.id === id);

      if (!tag) throw new Error(`Could not find tag with id ${id}`);

      return tag;
    });
  }

  getTags() {
    return this.TagsClient.readTags();
  }

  getTagsById(ids: Array<Tag["id"]>) {
    return this.loader.loadMany(ids);
  }

  async createTag(tag: Tag) {
    const tags = await this.TagsClient.readTags();

    const newTag = {
      id: tag.id,
      name: tag.name,
    };

    const tagAlreadyExists = tags.some(({ name }) => name === tag.name);

    if (!tagAlreadyExists) await this.TagsClient.saveTag(newTag);

    return newTag;
  }
}
