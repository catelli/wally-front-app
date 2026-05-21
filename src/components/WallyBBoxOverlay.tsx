import { useCallback, useState } from "react";
import type { Detection } from "@/types/inference";

interface WallyBBoxOverlayProps {
  imageSrc: string;
  detection: Detection | null;
  alt: string;
}

export function WallyBBoxOverlay({ imageSrc, detection, alt }: WallyBBoxOverlayProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const onLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setSize({ width: img.naturalWidth, height: img.naturalHeight });
  }, []);

  const boxStyle =
    detection && size
      ? {
          left: `${(detection.bbox.x1 / size.width) * 100}%`,
          top: `${(detection.bbox.y1 / size.height) * 100}%`,
          width: `${((detection.bbox.x2 - detection.bbox.x1) / size.width) * 100}%`,
          height: `${((detection.bbox.y2 - detection.bbox.y1) / size.height) * 100}%`,
        }
      : undefined;

  return (
    <div className="bbox-overlay" data-testid="wally-bbox-overlay">
      <img src={imageSrc} alt={alt} className="bbox-overlay__image" onLoad={onLoad} />
      {detection && boxStyle ? (
        <div
          className="bbox-overlay__box"
          style={boxStyle}
          data-testid="wally-bbox-highlight"
          aria-label={`Wally detectado com ${(detection.confidence * 100).toFixed(1)}% de confiança`}
        >
          <span className="bbox-overlay__label">
            Wally {(detection.confidence * 100).toFixed(0)}%
          </span>
        </div>
      ) : null}
    </div>
  );
}
