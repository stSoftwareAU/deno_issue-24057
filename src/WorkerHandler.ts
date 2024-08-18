export interface RequestData {
  taskID: number;

  initialize?: boolean;
}

export interface ResponseData {
  taskID: number;
  duration: number;

  initialize?: {
    status: string;
  };
}

interface WorkerEventListener {
  (worker: WorkerHandler): void;
}

export interface WorkerInterface {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  postMessage(data: RequestData): void;
  terminate(): void;
}

export class WorkerHandler {
  private worker: WorkerInterface;

  private taskID = 1;

  private busyCount = 0;
  private callbacks = new Map<number, CallableFunction>();
  private idleListeners: WorkerEventListener[] = [];

  constructor() {
    this.worker = new Worker(
      new URL("./deno/worker.ts", import.meta.url).href,
      {
        type: "module",
      },
    );

    this.worker.addEventListener("message", (message) => {
      const me = message as MessageEvent;

      this.callback(me.data as ResponseData);
    });
  }

  isBusy() {
    return this.busyCount > 0;
  }

  /** Notify listeners when worker no longer busy */
  addIdleListener(callback: WorkerEventListener) {
    this.idleListeners.push(callback);
    if (this.idleListeners.length > 1) {
      console.trace();
      console.warn(`Lots of listeners ${this.idleListeners.length}`);
    }
  }

  private callback(data: ResponseData) {
    const call = this.callbacks.get(data.taskID);
    if (call) {
      call(data);
      this.callbacks.delete(data.taskID);
    } else {
      throw new Error(`No callback for task ${data.taskID}`);
    }
  }

  private makePromise(data: RequestData) {
    this.busyCount++;
    const p = new Promise<ResponseData>((resolve) => {
      const call = (result: ResponseData) => {
        resolve(result);
        this.busyCount--;

        if (!this.isBusy()) {
          this.idleListeners.forEach((listener) => listener(this));
        }
      };

      this.callbacks.set(data.taskID, call);
    });

    this.worker.postMessage(data);

    return p;
  }

  terminate() {
    if (this.isBusy()) {
      console.warn("terminated but still busy", this.busyCount);
    }

    this.worker.terminate();
    this.idleListeners.length = 0;
  }

  initialize() {
    const data: RequestData = {
      taskID: this.taskID++,
      initialize: true,
    };

    return this.makePromise(data);
  }
}
