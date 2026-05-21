const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 15 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return "Use JPEG, PNG ou WebP.";
  }
  if (file.size > MAX_BYTES) {
    return "Arquivo muito grande (máx. 15 MB).";
  }
  return null;
}
