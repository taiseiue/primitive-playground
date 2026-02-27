import wasmUrl from "/primitive.wasm?url";
import "wasm_exec"; 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Go: any;

const go = new Go();

const wasmInstance = await WebAssembly.instantiateStreaming(
  fetch(wasmUrl),
  go.importObject
);
go.run(wasmInstance.instance);
console.log("Worker: go.run() called");
console.log("Worker: primitiveRun =", (self as any).primitiveRun);

self.onmessage = (e: MessageEvent) => {
  console.log("Worker: message received", e.data);
  const { imageBytes, params } = e.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).primitiveRun(
    imageBytes,
    params,
    (progress: number, svg: string, err: string | null) => {
      if (err) {
        self.postMessage({ type: "error", error: err });
        return;
      }
      self.postMessage({ type: "progress", progress, svg });
      if (progress === params.n) {
        self.postMessage({ type: "done" });
      }
    }
  );
};
