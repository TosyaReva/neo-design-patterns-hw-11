import { AbstractHandler } from "../AbstractHandler";
import { SystemErrorRecord } from "../../models/DataRecord";

const MAX_LENGTH = 255;

export class MessageTrimmer extends AbstractHandler {
  protected process(record: SystemErrorRecord): SystemErrorRecord {
    if (typeof record.message !== "string") throw new Error("Invalid message");

    let message = record.message.trim();
    if (message.length > MAX_LENGTH) message = message.substring(0, MAX_LENGTH);

    return { ...record, message };
  }
}
