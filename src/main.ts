import * as fs from "fs/promises";
import { buildAccessLogChain } from "./chain/chains/AccessLogChain";
import { buildTransactionChain } from "./chain/chains/TransactionChain";
import { buildSystemErrorChain } from "./chain/chains/SystemErrorChain";
import { ProcessingMediator } from "./mediator/ProcessingMediator";
import { AccessLogWriter } from "./mediator/writers/AccessLogWriter";
import { TransactionWriter } from "./mediator/writers/TransactionWriter";
import { ErrorLogWriter } from "./mediator/writers/ErrorLogWriter";
import { RejectedWriter } from "./mediator/writers/RejectedWriter";
import { DataRecord } from "./models/DataRecord";
import path from "path";

const handlerMap = {
  access_log: buildAccessLogChain,
  transaction: buildTransactionChain,
  system_error: buildSystemErrorChain,
};

async function main() {
  const stats = { dataLenght: 0, success: 0, rejected: 0 };
  const pathToData = path.resolve(__dirname, "./data/records.json");

  // зчитування даних
  const data = JSON.parse(
    await fs.readFile(pathToData, "utf-8")
  ) as DataRecord[];
  stats.dataLenght = data.length;

  // створення mediator
  const accessLogWriter = new AccessLogWriter();
  const transactionWriter = new TransactionWriter();
  const errorLogWriter = new ErrorLogWriter();
  const rejectedWriter = new RejectedWriter();

  const mediator = new ProcessingMediator(
    accessLogWriter,
    transactionWriter,
    errorLogWriter,
    rejectedWriter
  );

  // цикл по records:
  //   - вибір handler-а через handlerMap
  //   - try/catch: handle + mediator.onSuccess/onRejected
  for (const record of data) {
    try {
      const handler = handlerMap[record.type];
      const updatedRecord = handler().handle(record);

      mediator.onSuccess(updatedRecord);
      stats.success += 1;
    } catch (error) {
      stats.rejected += 1;
      let message = "Unknown Error";

      if (typeof error === "string") {
        message = error.toUpperCase();
      } else if (error instanceof Error) {
        message = error.message;
      }

      mediator.onRejected(record, String(message));
    }
  }

  // finalize
  mediator.finalize();

  console.log(`[INFO] Завантажено записів: ${stats.dataLenght}`);
  console.log(`[INFO] Успішно оброблено: ${stats.success}`);
  console.warn(`[WARN] Відхилено з помилками: ${stats.rejected}`);
  console.log("[INFO] Звіт збережено у директорії output/");
}

main();
