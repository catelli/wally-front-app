import { useId, useRef } from "react";
import { FiImage, FiUploadCloud } from "react-icons/fi";

interface ImageUploadZoneProps {
  disabled: boolean;
  fileName: string | null;
  onFileSelect: (file: File | null) => void;
}

export function ImageUploadZone({
  disabled,
  fileName,
  onFileSelect,
}: ImageUploadZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileSelect(file);
    event.target.value = "";
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    const file = event.dataTransfer.files[0] ?? null;
    onFileSelect(file);
  };

  return (
    <div
      className={`upload-zone${disabled ? " upload-zone--disabled" : ""}`}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      data-testid="wally-upload-dropzone"
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="upload-zone__input"
        disabled={disabled}
        onChange={handleChange}
        data-testid="wally-upload-file-input"
      />
      <FiUploadCloud aria-hidden className="upload-zone__icon" />
      <p className="upload-zone__title">Arraste uma cena ou clique para escolher</p>
      <p className="upload-zone__hint">JPEG, PNG ou WebP · até 15 MB</p>
      {fileName ? (
        <p className="upload-zone__file" data-testid="wally-upload-file-name">
          <FiImage aria-hidden />
          {fileName}
        </p>
      ) : null}
    </div>
  );
}
