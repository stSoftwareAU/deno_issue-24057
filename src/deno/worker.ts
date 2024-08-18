import { RequestData } from "../WorkerHandler.ts";
import { WorkerProcessor } from "../WorkerProcessor.ts";

const processor = new WorkerProcessor();
const workerSelf =
  // deno-lint-ignore ban-types
  (self as unknown) as { onmessage: Function; postMessage: Function };

workerSelf.onmessage = async function (message: { data: RequestData }) {
  const result = await processor.process(message.data);

  workerSelf.postMessage(result);
};
