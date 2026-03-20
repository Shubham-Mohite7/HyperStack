/*
 * Application entry point.
 *
 * In local development this file is run directly by Node, binding to PORT.
 * On Vercel, the default export is consumed by the serverless runtime —
 * no explicit listen() call is needed in that context.
 */

import "dotenv/config";
import express from "express";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { predictRouter } from "./routes/predict.js";
import { healthRouter } from "./routes/health.js";

const app = express();

// Middleware stack — order matters
app.use(corsMiddleware);
app.use(express.json({ limit: "50kb" }));
app.use(requestLogger);

// Route registration
app.use("/api/health", healthRouter);
app.use("/api/predict", predictRouter);

// Catch-all error handler — must be registered last
app.use(errorHandler);

// Bind to port only when running outside of a serverless environment
const isServerless = process.env.VERCEL === "1";

if (!isServerless) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`[server] Running at http://localhost:${port}`);
    console.log(`[server] Model: ${process.env.GROQ_MODEL}`);
  });
}

// Vercel expects the Express app as the default export
export default app;
