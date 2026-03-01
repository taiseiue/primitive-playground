import { useCallback, useRef, useState } from "react";
import styles from "./ImageDropzone.module.css";

interface Props {
  onLoad: (bytes: Uint8Array) => void;
}

export function ImageDropzone({ onLoad }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
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
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`${styles.dropzone} ${dragging ? styles.dragging : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className={styles.input}
      />
      <p className={styles.label}>
        {fileName ? fileName : "Drop image here or click to select"}
      </p>
    </div>
  );
}
