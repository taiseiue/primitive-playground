import { useState } from "react";
import { usePrimitive, type Params } from "./hooks/usePrimitive";
import { ImageDropzone } from "./components/ImageDropzone";
import { ParameterPanel } from "./components/ParameterPanel";
import { PreviewCanvas } from "./components/PreviewCanvas";
import styles from "./App.module.css";

export default function App() {
  const [imageBytes, setImageBytes] = useState<Uint8Array | null>(null);
  const { svg, progress, running, run, cancel } = usePrimitive();
  const [total, setTotal] = useState(100);

  const handleRun = (params: Params) => {
    if (!imageBytes) return;
    setTotal(params.n);
    run(imageBytes, params);
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h1 className={styles.title}>Primitive</h1>
        <ImageDropzone onLoad={setImageBytes} />
        <ParameterPanel
          onRun={handleRun}
          onCancel={cancel}
          running={running}
          hasImage={!!imageBytes}
        />
      <p>
        Original: <a href="https://github.com/fogleman/primitive" target="_blank">fogleman&#x2F;primitive</a><br/>
        This is: <a href="https://github.com/taiseiue/primitive-playground" target="_blank">taiseiue&#x2F;primitive-playground</a>
        </p>
      </aside>
      <main className={styles.main}>
        <PreviewCanvas svg={svg} progress={progress} total={total} running={running} />
      </main>
    </div>
  );
}
