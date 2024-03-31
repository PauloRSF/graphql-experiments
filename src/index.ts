import { config as loadEnvironment } from "dotenv";

import { container } from "./container/index.js";

loadEnvironment();

await container.graphqlServer.start();
