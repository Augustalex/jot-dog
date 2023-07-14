export function createBatchedFunction() {}

export function createBatcher(fn, sendData, batchTime) {
  let startTime = Date.now();
  const batch = [];

  const loop = () => {
    if (Date.now() - startTime > batchTime) {
      sendData({ type: "batch", batch });
      batch.length = 0;
      startTime = Date.now();
    }
  };
  setInterval(loop, batchTime);

  return async (...args) => {
    const result = await fn(...args);
    batch.push([result, Date.now() - startTime]);
  };
}

function isBatch(data) {
  return data.type === "batch";
}

export function playbackBatch({ batch }, consumeResult) {
  let intervalId;

  let stack = batch;
  let startTime = Date.now();
  const loop = () => {
    const [data, time] = stack[0];
    if (time - startTime) requestAnimationFrame(loop);
  };
  intervalId = setInterval(loop, 1000);
  for (const [result, time] of batch) {
  }
}
