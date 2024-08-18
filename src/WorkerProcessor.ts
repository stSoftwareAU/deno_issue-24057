import { RequestData, ResponseData } from "./WorkerHandler.ts";
import { History } from "./History.ts";

export class WorkerProcessor {
  private readonly LAST_YEAR = 2007;
  private history = new History();

  async process(data: RequestData): Promise<ResponseData> {
    const start = Date.now();

    if (data.initialize) {
      await this.history.init();

      return {
        taskID: data.taskID,
        duration: Date.now() - start,
        initialize: {
          status: "OK",
        },
      };
    } else {
      console.error(data);
      throw "unknown message";
    }
  }
}
