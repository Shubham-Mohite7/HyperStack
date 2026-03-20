/*
 * Prediction route.
 *
 * Accepts a project description, validates it, runs it through the three-stage
 * AI pipeline, and streams back a structured recommendation object.
 *
 * POST /api/predict
 * Body: { description: string }
 * Response: { requirements, scored, report }
 */

import { Router } from "express";
import { PredictionPipeline } from "../services/pipeline.js";
import { validatePredictInput } from "../lib/validators.js";

export const predictRouter = Router();

predictRouter.post("/", async (req, res, next) => {
  try {
    const { error, value } = validatePredictInput(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error, code: "VALIDATION_ERROR" },
      });
    }

    const pipeline = new PredictionPipeline();
    const result = await pipeline.run(value.description);

    res.json({ success: true, data: result });
  } catch (err) {
    // Delegate to the global error handler
    next(err);
  }
});
