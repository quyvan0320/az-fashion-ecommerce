import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createReviewValidator } from "../validators/review.validator";
import { reviewController } from "../controllers/review.controller";

const router = Router();

// create
router.post(
  "/:productId",
  authenticate,
  createReviewValidator,
  reviewController.createReview,
);

export default router;
