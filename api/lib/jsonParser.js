/*
 * JSON parsing utilities for LLM output.
 *
 * LLMs occasionally wrap JSON in markdown fences, add preamble text, or
 * produce minor structural deviations. These helpers make the parser
 * tolerant of those issues without accepting genuinely malformed output.
 */

/**
 * Extracts and parses the first JSON object found in a raw LLM response string.
 * Handles markdown code fences, leading/trailing text, and common type coercions.
 *
 * @param {string} raw - Raw string from the LLM completion
 * @param {string} stage - Label used in error messages for easier debugging
 * @returns {object} Parsed JSON object
 * @throws {Error} If no valid JSON object can be extracted
 */
export function extractJson(raw, stage = "unknown") {
  // Strip markdown code fences if present
  let cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Attempt to isolate the outermost JSON object
  const match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error(
      `[${stage}] No JSON object found in LLM response.\nRaw output:\n${raw.slice(0, 600)}`
    );
  }

  let jsonString = match[0];

  // Normalise app_type: the model occasionally returns an array instead of a string.
  // Flatten ["web app", "mobile app"] to "web app + mobile app".
  jsonString = jsonString.replace(
    /"app_type"\s*:\s*\[([^\]]+)\]/g,
    (_, inner) => {
      const joined = inner
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .join(" + ");
      return `"app_type": "${joined}"`;
    }
  );

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error(
      `[${stage}] JSON.parse failed: ${err.message}\nExtracted string:\n${jsonString.slice(0, 600)}`
    );
  }
}
