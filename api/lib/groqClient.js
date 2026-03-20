/*
 * Groq SDK client.
 *
 * Instantiated once at module load time and reused across all requests.
 * The SDK handles connection pooling and retries internally.
 */

import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error(
    "GROQ_API_KEY is not set. Add it to apps/api/.env before starting the server."
  );
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama3-70b-8192";
