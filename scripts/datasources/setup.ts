import { fsDatasource } from "../../src/datasources/fs/index.js";
import { httpDatasource } from "../../src/datasources/http/index.js";
import { sqlDatasource } from "../../src/datasources/sql/index.js";

sqlDatasource.setup();
await fsDatasource.setup();
await httpDatasource.setup();
