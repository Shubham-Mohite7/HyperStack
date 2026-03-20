/*
 * Centralised error handler.
 *
 * Express recognises a four-argument middleware as an error handler.
 * Any route or middleware that calls next(err) — or throws inside an
 * async wrapper — ends up here. We normalise the shape of every error
 * response so the client always receives a predictable JSON structure.
 */

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  const isDevelopment = process.env.NODE_ENV !== "production";

  const body = {
    error: {
      message: err.message || "An unexpected error occurred",
      code: err.code || "INTERNAL_ERROR",
      // Stack traces are only included in development to avoid leaking
      // implementation details to external clients in production.
      ...(isDevelopment && { stack: err.stack }),
    },
  };

  console.error(`[ERROR] ${status} — ${err.message}`);

  res.status(status).json(body);
}
