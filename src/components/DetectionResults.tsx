import { FiCheckCircle, FiCrosshair, FiXCircle } from "react-icons/fi";
import type { Detection } from "@/types/inference";

interface DetectionResultsProps {
  detections: Detection[];
  wallyFound: boolean;
  requestId: string | null;
}

export function DetectionResults({
  detections,
  wallyFound,
  requestId,
}: DetectionResultsProps) {
  const count = detections.length;

  return (
    <aside className="results-panel" data-testid="wally-results-panel">
      <header className="results-panel__header">
        <FiCrosshair aria-hidden />
        <h2>Possíveis localizações</h2>
        <span
          className={`results-panel__badge ${wallyFound ? "results-panel__badge--found" : "results-panel__badge--miss"}`}
          data-testid="wally-results-count"
        >
          {count}
        </span>
      </header>

      {requestId ? (
        <p className="results-panel__meta">
          <span className="results-panel__meta-label">Request</span>
          <code data-testid="wally-results-request-id">{requestId}</code>
        </p>
      ) : null}

      {!wallyFound || count === 0 ? (
        <p className="results-panel__empty" data-testid="wally-results-empty">
          <FiXCircle aria-hidden className="results-panel__empty-icon" />
          Nenhum Wally encontrado nesta imagem.
        </p>
      ) : (
        <ul className="results-panel__list">
          {detections.map((detection, index) => (
            <li
              key={`${detection.bbox.x1}-${detection.bbox.y1}-${detection.confidence}-${index}`}
              className={`results-panel__item ${index === 0 ? "results-panel__item--primary" : ""}`}
              data-testid={`wally-results-item-${index}`}
            >
              <FiCheckCircle aria-hidden className="results-panel__item-icon" />
              <div>
                <span className="results-panel__rank">#{index + 1}</span>
                <span className="results-panel__confidence">
                  {(detection.confidence * 100).toFixed(1)}% de confiança
                </span>
                <span className="results-panel__coords">
                  ({Math.round(detection.bbox.x1)}, {Math.round(detection.bbox.y1)}) → (
                  {Math.round(detection.bbox.x2)}, {Math.round(detection.bbox.y2)})
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
