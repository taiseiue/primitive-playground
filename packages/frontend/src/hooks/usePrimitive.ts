import { useState, useRef, useCallback } from "react";

export interface Params {
  n: number;
  mode: number;
  alpha: number;
  size: number;
}

export function usePrimitive() {
  const [svg, setSvg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const run = useCallback((imageBytes: Uint8Array, params: Params) => {
    workerRef.current?.terminate();

    const worker = new Worker(
      new URL("../worker/primitive.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;
    setRunning(true);
    setSvg(null);
    setProgress(0);

    worker.postMessage({ imageBytes, params }, [imageBytes.buffer]);

    worker.onmessage = (e: MessageEvent) => {
      const { type, progress, svg } = e.data;
      if (type === "progress") {
        setProgress(progress);
        setSvg(svg);
      } else if (type === "done") {
        setRunning(false);
      } else if (type === "error") {
        console.error(e.data.error);
        setRunning(false);
      }
    };
  }, []);

  const cancel = useCallback(() => {
    workerRef.current?.terminate();
    setRunning(false);
  }, []);

  return { svg, progress, running, run, cancel };
}
