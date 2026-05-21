import { useCallback, useState } from "react";
import type { Detection } from "@/types/inference";

interface WallyBBoxOverlayProps {
  imageSrc: string;
  detections: Detection[];
  alt: string;
}

const RANK_MODIFIERS = ["", "--alt2", "--alt3", "--alt4"] as const;

export function WallyBBoxOverlay({ imageSrc, detections, alt }: WallyBBoxOverlayProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const onLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setSize({ width: img.naturalWidth, height: img.naturalHeight });
  }, []);

  return (
    <div className="bbox-overlay" data-testid="wally-bbox-overlay">
      <img src={imageSrc} alt={alt} className="bbox-overlay__image" onLoad={onLoad} />
      {size
        ? detections.map((detection, index) => {
            const rank = index + 1;
            const modifier = RANK_MODIFIERS[index] ?? "--alt4";
            return (
              <div
                key={`${detection.bbox.x1}-${detection.bbox.y1}-${detection.confidence}-${rank}`}
                className={`bbox-overlay__box bbox-overlay__box${modifier}`}
                style={{
                  left: `${(detection.bbox.x1 / size.width) * 100}%`,
                  top: `${(detection.bbox.y1 / size.height) * 100}%`,
                  width: `${((detection.bbox.x2 - detection.bbox.x1) / size.width) * 100}%`,
                  height: `${((detection.bbox.y2 - detection.bbox.y1) / size.height) * 100}%`,
                }}
                data-testid={`wally-bbox-highlight-${index}`}
                aria-label={`Possibilidade ${rank}: Wally ${(detection.confidence * 100).toFixed(1)}%`}
              >
                <span className="bbox-overlay__label">
                  #{rank} {(detection.confidence * 100).toFixed(0)}%
                </span>
              </div>
            );
          })
        : null}
    </div>
  );
}
