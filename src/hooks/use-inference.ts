import { useCallback, useEffect, useState } from "react";
import { InferenceApiError, runInference } from "@/api/inference";
import { validateImageFile } from "@/lib/validate-image";
import type { Detection, InferenceResponse } from "@/types/inference";

type InferenceStatus = "idle" | "loading" | "success" | "error";

interface InferenceState {
  status: InferenceStatus;
  file: File | null;
  previewUrl: string | null;
  detections: Detection[];
  wallyFound: boolean;
  requestId: string | null;
  error: string | null;
}

const initialState: InferenceState = {
  status: "idle",
  file: null,
  previewUrl: null,
  detections: [],
  wallyFound: false,
  requestId: null,
  error: null,
};

export function useInference() {
  const [state, setState] = useState<InferenceState>(initialState);

  useEffect(() => {
    if (!state.file) {
      return;
    }
    const url = URL.createObjectURL(state.file);
    setState((prev) => ({ ...prev, previewUrl: url }));
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [state.file]);

  const selectFile = useCallback((file: File | null) => {
    if (!file) {
      setState(initialState);
      return;
    }
    const validationError = validateImageFile(file);
    if (validationError) {
      setState({
        ...initialState,
        status: "error",
        error: validationError,
      });
      return;
    }
    setState({
      ...initialState,
      file,
      status: "idle",
    });
  }, []);

  const submit = useCallback(async () => {
    if (!state.file) {
      return;
    }
    setState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
      detections: [],
      wallyFound: false,
      requestId: null,
    }));

    try {
      const result: InferenceResponse = await runInference(state.file);
      setState((prev) => ({
        ...prev,
        status: "success",
        detections: result.detections,
        wallyFound: result.wally_found && result.detections.length > 0,
        requestId: result.request_id,
      }));
    } catch (error) {
      const message =
        error instanceof InferenceApiError
          ? error.message
          : "Erro de rede. Verifique a conexão com a API.";
      setState((prev) => ({
        ...prev,
        status: "error",
        error: message,
      }));
    }
  }, [state.file]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    isLoading: state.status === "loading",
    canSubmit: state.file !== null && state.status !== "loading",
    selectFile,
    submit,
    reset,
  };
}
