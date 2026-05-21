import { FiImage } from "react-icons/fi";
import { WallyBBoxOverlay } from "@/components/WallyBBoxOverlay";
import type { Detection } from "@/types/inference";

interface AnnotatedPreviewProps {
  previewSrc: string | null;
  detection: Detection | null;
  wallyFound: boolean;
  isLoading: boolean;
}

export function AnnotatedPreview({
  previewSrc,
  detection,
  wallyFound,
  isLoading,
}: AnnotatedPreviewProps) {
  const showOverlay = Boolean(previewSrc && detection && wallyFound);

  return (
    <section className="preview-panel" aria-busy={isLoading}>
      <header className="preview-panel__header">
        <FiImage aria-hidden />
        <h2>{showOverlay ? "Wally encontrado" : "Pré-visualização"}</h2>
      </header>

      <div className="preview-panel__frame" data-testid="wally-preview-frame">
        {isLoading ? (
          <div className="preview-panel__placeholder preview-panel__placeholder--loading">
            <span className="preview-panel__spinner" aria-hidden />
            <p>Procurando Wally…</p>
          </div>
        ) : showOverlay && previewSrc ? (
          <WallyBBoxOverlay
            imageSrc={previewSrc}
            detection={detection}
            alt="Imagem com a localização do Wally destacada"
          />
        ) : previewSrc ? (
          <img
            src={previewSrc}
            alt="Pré-visualização da imagem enviada"
            className="preview-panel__image"
            data-testid="wally-preview-image"
          />
        ) : (
          <div className="preview-panel__placeholder">
            <p>Envie uma página para ver o resultado aqui.</p>
          </div>
        )}
      </div>
    </section>
  );
}
