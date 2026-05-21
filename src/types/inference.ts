export interface Detection {
  class_id: number;
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface AnnotatedImage {
  data_base64: string;
  media_type?: string;
}

export interface InferenceResponse {
  request_id: string;
  detections: Detection[];
  annotated_image: AnnotatedImage;
}

export interface ApiErrorBody {
  detail?: string | { msg: string }[];
  message?: string;
}
