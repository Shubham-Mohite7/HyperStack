/*
 * CORS configuration.
 *
 * In development the client runs on a different port, so we need explicit
 * cross-origin permission. In production on Vercel, both apps are served
 * from the same domain so CORS is largely a non-issue, but we keep the
 * header configuration for any external consumers of the API.
 */

import cors from "cors";

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "https://hyperstack.vercel.app",
  "http://127.0.0.1:62493",
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // In production (Vercel), allow all origins since routing handles domain
    if (process.env.VERCEL === "1") {
      callback(null, true);
    } else {
      // In development, be more restrictive
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' is not permitted`));
      }
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
