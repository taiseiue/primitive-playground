import { useMemo } from "react";
import styles from "./PreviewCanvas.module.css";

interface Props {
  svg: string | null;
  progress: number;
  total: number;
  running: boolean;
}

/** SVG に viewBox が無ければ width/height から補完する（CSS スケーリング用） */
function ensureViewBox(svg: string): string {
  if (svg.includes("viewBox")) return svg;
  const wMatch = svg.match(/<svg[^>]*\bwidth="(\d+(?:\.\d+)?)"/);
  const hMatch = svg.match(/<svg[^>]*\bheight="(\d+(?:\.\d+)?)"/);
  if (wMatch && hMatch) {
    return svg.replace("<svg", `<svg viewBox="0 0 ${wMatch[1]} ${hMatch[1]}"`);
  }
  return svg;
}

export function PreviewCanvas({ svg, progress, total, running }: Props) {
  const displaySvg = useMemo(() => (svg ? ensureViewBox(svg) : null), [svg]);

  const handleDownloadPng = () => {
    if (!svg) return;
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
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
      {displaySvg ? (
        <>
          <div className={styles.svg} dangerouslySetInnerHTML={{ __html: displaySvg }} />
          <div className={styles.footer}>
            <span>{progress} / {total} shapes</span>
            <button onClick={handleDownloadPng}>Save as PNG</button>
          </div>
        </>
      ) : running ? (
        <div className={styles.loading}>Please wait...</div>
      ) : (
        <div className={styles.empty}>Please select an image and press the generate button.</div>
      )}
    </div>
  );
}
