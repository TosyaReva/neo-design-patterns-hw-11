import { AbstractHandler } from "../AbstractHandler";
import { SystemErrorRecord } from "../../models/DataRecord";

const allowed = ["info", "warning", "critical"];

export class LevelValidator extends AbstractHandler {
  protected process(record: SystemErrorRecord): SystemErrorRecord {
    if (allowed.indexOf(record.level) === -1) throw new Error("Invalid IP");

    return record;
  }
}
