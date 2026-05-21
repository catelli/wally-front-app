import { FiCheckCircle, FiCrosshair } from "react-icons/fi";
import type { Detection } from "@/types/inference";

interface DetectionResultsProps {
  detections: Detection[];
  requestId: string | null;
}

export function DetectionResults({ detections, requestId }: DetectionResultsProps) {
  const count = detections.length;

  return (
    <aside className="results-panel" data-testid="wally-results-panel">
      <header className="results-panel__header">
        <FiCrosshair aria-hidden />
        <h2>Detecções</h2>
        <span className="results-panel__badge" data-testid="wally-results-count">
          {count}
        </span>
      </header>

      {requestId ? (
        <p className="results-panel__meta">
          <span className="results-panel__meta-label">Request</span>
          <code data-testid="wally-results-request-id">{requestId}</code>
        </p>
      ) : null}

      {count === 0 ? (
        <p className="results-panel__empty" data-testid="wally-results-empty">
          Nenhum Wally encontrado nesta imagem.
        </p>
      ) : (
        <ul className="results-panel__list">
          {detections.map((detection, index) => (
            <li
              key={`${detection.x1}-${detection.y1}-${detection.confidence}-${index}`}
              className="results-panel__item"
              data-testid={`wally-results-item-${index}`}
            >
              <FiCheckCircle aria-hidden className="results-panel__item-icon" />
              <div>
                <span className="results-panel__confidence">
                  {(detection.confidence * 100).toFixed(1)}%
                </span>
                <span className="results-panel__coords">
                  ({Math.round(detection.x1)}, {Math.round(detection.y1)}) → (
                  {Math.round(detection.x2)}, {Math.round(detection.y2)})
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
