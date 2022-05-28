import { SimpleMap } from "../structures/helpers";

export interface Entity {
  asInsertable(): SimpleMap;
}
