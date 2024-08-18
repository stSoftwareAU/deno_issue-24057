// deno-lint-ignore-file no-explicit-any
import { WorkerHandler } from "./WorkerHandler.ts";

try {
  Deno.removeSync(".data", { recursive: true });
} catch (_e) {
  // ignore
}
Deno.mkdirSync(".data");

const data = JSON.parse(Deno.readTextFileSync("template/data.json"));

function prefixKeys(obj: any, prefix: string): any {
  const newObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      newObj[`${prefix}${key}`] = prefixKeys(value, prefix);
    } else {
      newObj[`${prefix}${key}`] = value;
    }
  }
  return newObj;
}

for (let i = 0; i < 100; i++) {
  const prefixedData = prefixKeys(data, `${i}_`);
  Deno.writeTextFileSync(
    `.data/${i}.json`,
    JSON.stringify(prefixedData, null, 2),
  );
}

async function init() {
  const workerCount = 12;
  const workers: WorkerHandler[] = [];
  for (let i = workerCount; i--;) {
    const w = new WorkerHandler();
    await w.initialize();
    console.info(`Worker ${i} started`);

    workers.push(w);
  }

  workers.forEach((w) => w.terminate());
}

await init();
