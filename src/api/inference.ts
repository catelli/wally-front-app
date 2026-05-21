import { getApiBaseUrl } from "@/api/client";
import type { ApiErrorBody, Detection, InferenceResponse } from "@/types/inference";

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

interface ApiDetectionPayload {
  class_id: number;
  label: string;
  confidence: number;
  bbox: Detection["bbox"];
}

interface ApiInferencePayload {
  request_id: string;
  wally_found?: boolean;
  detection_count: number;
  detections: ApiDetectionPayload[];
  annotated_image: {
    data_base64: string;
    content_type?: string;
    media_type?: string;
  };
}

function normalizeResponse(payload: ApiInferencePayload): InferenceResponse {
  const detections: Detection[] = payload.detections.map((item) => ({
    class_id: item.class_id,
    label: item.label,
    confidence: item.confidence,
    bbox: item.bbox,
  }));

  return {
    request_id: payload.request_id,
    wally_found: payload.wally_found ?? detections.length > 0,
    detection_count: payload.detection_count,
    detections,
    annotated_image: {
      data_base64: payload.annotated_image.data_base64,
      content_type: payload.annotated_image.content_type,
      media_type:
        payload.annotated_image.media_type ?? payload.annotated_image.content_type,
    },
  };
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

  const payload = (await response.json()) as ApiInferencePayload;
  return normalizeResponse(payload);
}

export function toAnnotatedImageSrc(dataBase64: string, mediaType = "image/jpeg"): string {
  return `data:${mediaType};base64,${dataBase64}`;
}

export function getPrimaryDetection(detections: Detection[]): Detection | null {
  if (detections.length === 0) {
    return null;
  }
  return detections.reduce((best, current) =>
    current.confidence > best.confidence ? current : best,
  );
}
