export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Detection {
  class_id: number;
  label: string;
  confidence: number;
  bbox: BoundingBox;
}

export interface AnnotatedImage {
  data_base64: string;
  content_type?: string;
  media_type?: string;
}

export interface InferenceResponse {
  request_id: string;
  wally_found: boolean;
  detection_count: number;
  detections: Detection[];
  annotated_image: AnnotatedImage;
}

export interface ApiErrorBody {
  detail?: string | { msg: string }[];
  message?: string;
}
