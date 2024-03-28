import { httpServer } from "./datasources/http/server.js";
import { graphql } from "./graphql/index.js";

await httpServer.start();
await graphql.start();
