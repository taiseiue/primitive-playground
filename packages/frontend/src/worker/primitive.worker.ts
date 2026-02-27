import wasmUrl from "/primitive.wasm?url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Go: any;

const go = new Go();

const wasmInstance = await WebAssembly.instantiateStreaming(
  fetch(wasmUrl),
  go.importObject
);
go.run(wasmInstance.instance);

self.onmessage = (e: MessageEvent) => {
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
