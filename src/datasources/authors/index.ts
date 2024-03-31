import DataLoader from "dataloader";

import {
  type Author,
  type AuthorWithUnresolvedRelations,
} from "../../types/index.js";
import { type AuthorsSqlClient } from "./sql.js";

type Dependencies = {
  AuthorsClient: AuthorsSqlClient;
};

export class AuthorsDataSource {
  private AuthorsClient: AuthorsSqlClient;

  private loader: DataLoader<Author["id"], AuthorWithUnresolvedRelations>;

  constructor({ AuthorsClient }: Dependencies) {
    this.AuthorsClient = AuthorsClient;

    this.loader = new DataLoader(this.loadAuthorBatch.bind(this));
  }

  private async loadAuthorBatch(ids: Readonly<Array<Author["id"]>>) {
    return this.AuthorsClient.getAuthorsById([...ids]);
  }

  getAuthors() {
    return this.AuthorsClient.getAuthors();
  }

  getAuthor(id: number) {
    return this.loader.load(id) as Promise<Author>;
  }

  saveAuthor(author: Author) {
    this.AuthorsClient.saveAuthor(author);
  }
}
