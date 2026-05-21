import { getApiBaseUrl } from "@/api/client";
import type { ApiErrorBody, InferenceResponse } from "@/types/inference";

export class InferenceApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "InferenceApiError";
    this.status = status;
  }
}

function parseErrorMessage(body: ApiErrorBody, status: number): string {
  if (typeof body.detail === "string") {
    return body.detail;
  }
  if (Array.isArray(body.detail) && body.detail.length > 0) {
    return body.detail.map((item) => item.msg).join("; ");
  }
  if (body.message) {
    return body.message;
  }
  if (status === 413) {
    return "Imagem muito grande. Tente um arquivo menor.";
  }
  if (status >= 502) {
    return "Serviço de detecção indisponível. Tente novamente.";
  }
  return "Não foi possível processar a imagem.";
}

export async function runInference(file: File): Promise<InferenceResponse> {
  const base = getApiBaseUrl();
  const url = `${base}/api/v1/inference`;
  const form = new FormData();
  form.append("file", file, file.name);

  const response = await fetch(url, { method: "POST", body: form });

  if (!response.ok) {
    let message = parseErrorMessage({}, response.status);
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      try {
        const body = (await response.json()) as ApiErrorBody;
        message = parseErrorMessage(body, response.status);
      } catch {
        // keep default message
      }
    }
    throw new InferenceApiError(message, response.status);
  }

  return (await response.json()) as InferenceResponse;
}

export function toAnnotatedImageSrc(dataBase64: string, mediaType = "image/jpeg"): string {
  return `data:${mediaType};base64,${dataBase64}`;
}
