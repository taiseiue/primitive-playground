import { useState, useRef, useCallback } from "react";

export interface Params {
  n: number;
  mode: number;
  alpha: number;
  size: number;
  inputSize: number;
  batch: number;
}

export function usePrimitive() {
  const [svg, setSvg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const runningRef = useRef(false);

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker(
      new URL("../worker/primitive.worker.ts", import.meta.url),
      { type: "module" }
    );
    worker.onmessage = (e: MessageEvent) => {
      const { type, progress, svg } = e.data;
      if (type === "progress") {
        setProgress(progress);
        setSvg(svg);
      } else if (type === "done") {
        runningRef.current = false;
        setRunning(false);
      } else if (type === "error") {
        console.error(e.data.error);
        runningRef.current = false;
        setRunning(false);
      }
    };
    workerRef.current = worker;
    return worker;
  }, []);

  const run = useCallback((imageBytes: Uint8Array, params: Params) => {
    // 実行中の場合のみ terminate して再作成（Go の同期ループは中断不可）
    if (runningRef.current && workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    const worker = ensureWorker();
    runningRef.current = true;
    setRunning(true);
    setSvg(null);
    setProgress(0);

    // buffer を transfer しない（imageBytes を後続の実行でも再利用できるようにする）
    worker.postMessage({ imageBytes, params });
  }, [ensureWorker]);

  const cancel = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    runningRef.current = false;
    setRunning(false);
  }, []);

  return { svg, progress, running, run, cancel };
}
