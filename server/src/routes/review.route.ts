import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createReviewValidator,
  reviewIdValidator,
  updateReviewValidator,
} from "../validators/review.validator";
import { reviewController } from "../controllers/review.controller";

const router = Router();

router.get("/my", authenticate, reviewController.getUserReviews);

router.get("/:id", reviewIdValidator, reviewController.getReviewById);

router.put("/:id", authenticate, updateReviewValidator, reviewController.updateReview);


export default router;
