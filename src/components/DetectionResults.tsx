import { FiCheckCircle, FiCrosshair, FiXCircle } from "react-icons/fi";
import type { Detection } from "@/types/inference";

interface DetectionResultsProps {
  detection: Detection | null;
  wallyFound: boolean;
  requestId: string | null;
}

export function DetectionResults({
  detection,
  wallyFound,
  requestId,
}: DetectionResultsProps) {
  return (
    <aside className="results-panel" data-testid="wally-results-panel">
      <header className="results-panel__header">
        <FiCrosshair aria-hidden />
        <h2>Resultado</h2>
        <span
          className={`results-panel__badge ${wallyFound ? "results-panel__badge--found" : "results-panel__badge--miss"}`}
          data-testid="wally-results-count"
        >
          {wallyFound ? "1" : "0"}
        </span>
      </header>

      {requestId ? (
        <p className="results-panel__meta">
          <span className="results-panel__meta-label">Request</span>
          <code data-testid="wally-results-request-id">{requestId}</code>
        </p>
      ) : null}

      {!wallyFound || !detection ? (
        <p className="results-panel__empty" data-testid="wally-results-empty">
          <FiXCircle aria-hidden className="results-panel__empty-icon" />
          Nenhum Wally encontrado nesta imagem.
        </p>
      ) : (
        <div className="results-panel__highlight" data-testid="wally-results-primary">
          <FiCheckCircle aria-hidden className="results-panel__item-icon" />
          <div>
            <p className="results-panel__title">Localização do Wally</p>
            <span className="results-panel__confidence">
              Confiança {(detection.confidence * 100).toFixed(1)}%
            </span>
            <span className="results-panel__coords">
              ({Math.round(detection.bbox.x1)}, {Math.round(detection.bbox.y1)}) → (
              {Math.round(detection.bbox.x2)}, {Math.round(detection.bbox.y2)})
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
