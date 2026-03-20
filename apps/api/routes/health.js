/*
 * Health check endpoint.
 *
 * Used by Vercel to verify the function is reachable, and by monitoring
 * tools to confirm the service is live. Returns the configured model name
 * so clients can confirm which LLM backend is active.
 */

import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.json({
    status: "ok",
    model: process.env.GROQ_MODEL || "not configured",
    timestamp: new Date().toISOString(),
  });
});
