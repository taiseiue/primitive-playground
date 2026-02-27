import styles from "./PreviewCanvas.module.css";

interface Props {
  svg: string | null;
  progress: number;
  total: number;
  running: boolean;
}

export function PreviewCanvas({ svg, progress, total, running }: Props) {
  const handleDownloadPng = () => {
    if (!svg) return;
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "primitive.png";
      a.click();
      URL.revokeObjectURL(url);
    };
  };

  return (
    <div className={styles.container}>
      {svg ? (
        <>
          <div className={styles.svg} dangerouslySetInnerHTML={{ __html: svg }} />
          <div className={styles.footer}>
            <span>{progress} / {total} shapes</span>
            <button onClick={handleDownloadPng}>PNG で保存</button>
          </div>
        </>
      ) : running ? (
        <div className={styles.loading}>Please wait...</div>
      ) : (
        <div className={styles.empty}>画像を選択して生成ボタンを押してください</div>
      )}
    </div>
  );
}
