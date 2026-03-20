/*
 * API client.
 *
 * A single Axios instance configured for all API calls. The base URL resolves
 * to an empty string in production (same-origin on Vercel) and is proxied by
 * Vite during local development via the proxy config in vite.config.ts.
 */

import axios from "axios";
import type { ApiResponse } from "@/types";

const client = axios.create({
  baseURL: "",
  timeout: 120_000, // 2 minutes — LLM calls can take time on large inputs
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    /*
     * Normalise API errors into a consistent shape so UI components
     * only need to handle one error format regardless of status code.
     */
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject(new Error(message));
  }
);

export async function predictStack(description: string): Promise<ApiResponse> {
  const response = await client.post<ApiResponse>("/api/predict", { description });
  return response.data;
}

export async function checkHealth(): Promise<{ status: string; model: string }> {
  const response = await client.get("/api/health");
  return response.data;
}
