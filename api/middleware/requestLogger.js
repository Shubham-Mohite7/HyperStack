/*
 * Lightweight request logger.
 *
 * Logs method, path, status code, and response time to stdout.
 * In production on Vercel, stdout is captured by the platform's log drain.
 * We intentionally avoid a heavy dependency like Morgan for this simple use case.
 */

export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? "ERROR" : res.statusCode >= 400 ? "WARN" : "INFO";
    console.log(`[${level}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
}
