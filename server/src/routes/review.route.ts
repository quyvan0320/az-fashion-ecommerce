import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createReviewValidator } from "../validators/review.validator";
import { reviewController } from "../controllers/review.controller";

const router = Router();

router.get("/my", authenticate, reviewController.getUserReviews);

export default router;
