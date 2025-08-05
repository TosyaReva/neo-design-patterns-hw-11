import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

function isValidISODate(isoString: string): boolean {
  // Regex for ISO 8601 format (e.g., "2025-05-01T12:00:00Z")
  const isoRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[\+\-]\d{2}:\d{2})$/;

  // Check if string matches ISO format and is a valid date
  return isoRegex.test(isoString) && !isNaN(Date.parse(isoString));
}

export class TimestampParser extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    const isValid = isValidISODate(record.timestamp);
    if (!isValid) throw new Error("Invalid timestamp");

    return record;
  }
}
