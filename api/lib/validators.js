/*
 * Input validation helpers.
 *
 * We keep validation logic here rather than inline in route handlers so it
 * can be unit-tested in isolation and reused across routes.
 */

const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 2000;

/**
 * Validates the request body for POST /api/predict.
 * Returns { error: string | null, value: { description: string } }.
 */
export function validatePredictInput(body) {
  const description = (body?.description || "").trim();

  if (!description) {
    return { error: "description is required", value: null };
  }

  if (description.length < MIN_DESCRIPTION_LENGTH) {
    return {
      error: `description must be at least ${MIN_DESCRIPTION_LENGTH} characters`,
      value: null,
    };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      error: `description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
      value: null,
    };
  }

  return { error: null, value: { description } };
}
