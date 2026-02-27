import { useCallback } from "react";
import styles from "./ImageDropzone.module.css";

interface Props {
  onLoad: (bytes: Uint8Array) => void;
}

export function ImageDropzone({ onLoad }: Props) {
  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const bytes = new Uint8Array(e.target!.result as ArrayBuffer);
      onLoad(bytes);
    };
    reader.readAsArrayBuffer(file);
  }, [onLoad]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={styles.dropzone}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <p>画像をドロップ</p>
      <p>または</p>
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}
