import { AbstractHandler } from "../AbstractHandler";
import { TransactionRecord } from "../../models/DataRecord";

export class CurrencyNormalizer extends AbstractHandler {
  protected process(record: TransactionRecord): TransactionRecord {
    if (typeof record.currency !== "string")
      throw new Error("Invalid currency");

    const currency = record.currency.toUpperCase();

    return { ...record, currency };
  }
}
