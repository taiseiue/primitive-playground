import { useState } from "react";
import type { Params } from "../hooks/usePrimitive";
import styles from "./ParameterPanel.module.css";

const MODES = [
  { value: 0, label: "Combo" },
  { value: 1, label: "Triangle" },
  { value: 2, label: "Rectangle" },
  { value: 3, label: "Ellipse" },
  { value: 4, label: "Circle" },
  { value: 5, label: "Rotated Rectangle" },
  { value: 6, label: "Beziers" },
  { value: 7, label: "Rotated Ellipse" },
  { value: 8, label: "Polygon" },
];

interface Props {
  onRun: (params: Params) => void;
  onCancel: () => void;
  running: boolean;
  hasImage: boolean;
}

export function ParameterPanel({ onRun, onCancel, running, hasImage }: Props) {
  const [n, setN] = useState(100);
  const [mode, setMode] = useState(1);
  const [alpha, setAlpha] = useState(128);
  const [size, setSize] = useState(256);
  const [batch, setBatch] = useState(10);

  return (
    <div className={styles.panel}>
      <label className={styles.field}>
        <span>Shapes: {n}</span>
        <input type="range" min={10} max={500} value={n} onChange={(e) => setN(Number(e.target.value))} />
      </label>

      <label className={styles.field}>
        <span>Mode</span>
        <select value={mode} onChange={(e) => setMode(Number(e.target.value))}>
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>Alpha: {alpha}</span>
        <input type="range" min={0} max={255} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
      </label>

      <label className={styles.field}>
        <span>Output size: {size}px</span>
        <input type="range" min={32} max={2048} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} />
      </label>

      <label className={styles.field}>
        <span>Preview interval: {batch} shapes</span>
        <input type="range" min={1} max={100} value={batch} onChange={(e) => setBatch(Number(e.target.value))} />
      </label>

      {running ? (
        <button className={styles.cancelButton} onClick={onCancel}>キャンセル</button>
      ) : (
        <button className={styles.runButton} onClick={() => onRun({ n, mode, alpha, size, batch })} disabled={!hasImage}>
          生成
        </button>
      )}
    </div>
  );
}
