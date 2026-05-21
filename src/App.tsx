import { FiLoader, FiRefreshCw, FiSearch } from "react-icons/fi";
import { AnnotatedPreview } from "@/components/AnnotatedPreview";
import { DetectionResults } from "@/components/DetectionResults";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import { useInference } from "@/hooks/use-inference";

export function App() {
  const {
    file,
    previewUrl,
    detection,
    wallyFound,
    requestId,
    error,
    isLoading,
    canSubmit,
    selectFile,
    submit,
    reset,
  } = useInference();

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden />
          <div>
            <p className="app__eyebrow">Where&apos;s Wally</p>
            <h1>Wally Finder</h1>
          </div>
        </div>
        <p className="app__subtitle">
          Envie uma cena completa e veja exatamente onde o Wally está — uma única marcação na imagem.
        </p>
      </header>

      <main className="app__main">
        <section className="app__controls">
          <ImageUploadZone
            disabled={isLoading}
            fileName={file?.name ?? null}
            onFileSelect={selectFile}
          />

          {error ? (
            <p className="app__error" role="alert" data-testid="wally-upload-error">
              {error}
            </p>
          ) : null}

          <div className="app__actions">
            <button
              type="button"
              className="button button--primary"
              disabled={!canSubmit}
              onClick={() => {
                void submit();
              }}
              data-testid="wally-upload-submit-button"
            >
              {isLoading ? (
                <FiLoader aria-hidden className="button__icon button__icon--spin" />
              ) : (
                <FiSearch aria-hidden className="button__icon" />
              )}
              {isLoading ? "Analisando…" : "Encontrar Wally"}
            </button>

            {(file || detection) && !isLoading ? (
              <button
                type="button"
                className="button button--ghost"
                onClick={reset}
                data-testid="wally-upload-reset-button"
              >
                <FiRefreshCw aria-hidden className="button__icon" />
                Nova imagem
              </button>
            ) : null}
          </div>

          <DetectionResults
            detection={detection}
            wallyFound={wallyFound}
            requestId={requestId}
          />
        </section>

        <AnnotatedPreview
          previewSrc={previewUrl}
          detection={detection}
          wallyFound={wallyFound}
          isLoading={isLoading}
        />
      </main>

      <footer className="app__footer">
        <span>API</span>
        <code>/api/v1/inference</code>
      </footer>
    </div>
  );
}
