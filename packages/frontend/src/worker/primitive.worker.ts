import wasmUrl from "/primitive.wasm?url";
import "wasm_exec";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Go: any;

type PrimitiveRun = (
  imageBytes: Uint8Array,
  params: unknown,
  callback: (progress: number, svg: string, err: string | null) => void
) => void;

// onmessage は await より前に登録する。
// module worker では top-level await 中もイベントループが動くため、
// await 後に onmessage を登録するとメッセージがドロップされる。
let pendingEvent: MessageEvent | null = null;
let wasmReady = false;

self.onmessage = (e: MessageEvent) => {
  if (wasmReady) {
    processMessage(e);
  } else {
    pendingEvent = e;
  }
};

function processMessage(e: MessageEvent) {
  const { imageBytes, params } = e.data;

  const primitiveRun = (self as unknown as { primitiveRun: PrimitiveRun }).primitiveRun;
  primitiveRun(
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
}

const go = new Go();
const wasmInstance = await WebAssembly.instantiateStreaming(
  fetch(wasmUrl),
  go.importObject
);
go.run(wasmInstance.instance);

wasmReady = true;
if (pendingEvent) {
  processMessage(pendingEvent);
  pendingEvent = null;
}
