import { FiImage } from "react-icons/fi";

interface AnnotatedPreviewProps {
  annotatedSrc: string | null;
  previewSrc: string | null;
  isLoading: boolean;
}

export function AnnotatedPreview({
  annotatedSrc,
  previewSrc,
  isLoading,
}: AnnotatedPreviewProps) {
  const src = annotatedSrc ?? previewSrc;

  return (
    <section className="preview-panel" aria-busy={isLoading}>
      <header className="preview-panel__header">
        <FiImage aria-hidden />
        <h2>{annotatedSrc ? "Resultado anotado" : "Pré-visualização"}</h2>
      </header>

      <div className="preview-panel__frame" data-testid="wally-preview-frame">
        {isLoading ? (
          <div className="preview-panel__placeholder preview-panel__placeholder--loading">
            <span className="preview-panel__spinner" aria-hidden />
            <p>Procurando Wally…</p>
          </div>
        ) : src ? (
          <img
            src={src}
            alt={
              annotatedSrc
                ? "Imagem com caixas de detecção do Wally"
                : "Pré-visualização da imagem enviada"
            }
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
