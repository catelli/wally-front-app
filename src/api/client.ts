const DEFAULT_BASE = "https://wallyfinder-api.ngrok.app";

export function getApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (typeof env === "string" && env.length > 0) {
    return env.replace(/\/$/, "");
  }
  if (import.meta.env.DEV) {
    return "";
  }
  return DEFAULT_BASE;
}
