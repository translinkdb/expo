import { toInt } from "../../helpers/typeConverters";
import { SimpleMap } from "../../structures/helpers";
import { Entity } from "../entity";

export class Vehicle implements Entity {
  id: number;

  constructor(raw: SimpleMap) {
    this.id = toInt(raw.id)!;
  }

  asInsertable(): SimpleMap<any> {
    return {
      id: this.id,
    };
  }
}
