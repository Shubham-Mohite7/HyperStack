/*
 * usePrediction hook.
 *
 * Encapsulates the prediction request lifecycle, including optimistic stage
 * progression. Because the API returns a single response (not a stream), we
 * simulate stage transitions with timed delays so the UI communicates progress
 * meaningfully rather than showing a spinner for the full duration.
 */

import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { predictStack } from "@/lib/apiClient";
import { savePrediction } from "@/lib/database";
import { useAuth } from "@/contexts/AuthContext";
import type { PipelineState, PipelineStage, PredictionResult } from "@/types";

const STAGE_SEQUENCE: PipelineStage[] = ["extracting", "scoring", "reporting"];
const STAGE_DURATIONS = [3000, 3500, 4000]; // ms — approximate time per stage

export function usePrediction() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<PipelineState>({
    stage: "idle",
    result: null,
    error: null,
  });

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const advanceStage = useCallback((stages: PipelineStage[], index: number) => {
    if (index >= stages.length) return;

    setState((prev) => ({ ...prev, stage: stages[index] }));

    timerRef.current = setTimeout(() => {
      advanceStage(stages, index + 1);
    }, STAGE_DURATIONS[index]);
  }, []);

  const run = useCallback(
    async (description: string) => {
      if (!user) {
        setState({ stage: "error", result: null, error: "Please sign in to make predictions" });
        return;
      }

      clearTimers();

      setState({ stage: "extracting", result: null, error: null });

      // Begin optimistic stage animation while the real request is in flight
      timerRef.current = setTimeout(() => {
        advanceStage(STAGE_SEQUENCE.slice(1), 0);
      }, STAGE_DURATIONS[0]);

      try {
        const response = await predictStack(description);
        clearTimers();

        // Save prediction to database
        try {
          await savePrediction(user.id, description, response.data);
        } catch (dbError) {
          console.error("Failed to save prediction to database:", dbError);
          // Continue even if database save fails
        }

        setState({ stage: "done", result: response.data, error: null });

        // Navigate to the results page, passing the result via router state
        navigate("/results", { state: { result: response.data } });
      } catch (err) {
        clearTimers();
        const message = err instanceof Error ? err.message : "Prediction failed";
        setState({ stage: "error", result: null, error: message });
      }
    },
    [navigate, advanceStage, user]
  );

  const reset = useCallback(() => {
    clearTimers();
    setState({ stage: "idle", result: null, error: null });
  }, []);

  return { state, run, reset };
}

/*
 * Lightweight hook for persisting the last result to sessionStorage so the
 * results page survives a browser refresh during development.
 */
export function usePersistedResult() {
  const saveResult = (result: PredictionResult) => {
    try {
      sessionStorage.setItem("hyperstack_result", JSON.stringify(result));
    } catch {
      // Storage quota exceeded or private browsing — fail silently
    }
  };

  const loadResult = (): PredictionResult | null => {
    try {
      const raw = sessionStorage.getItem("hyperstack_result");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  return { saveResult, loadResult };
}
