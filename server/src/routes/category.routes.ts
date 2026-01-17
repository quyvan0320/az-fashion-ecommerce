import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { createCategoryValidator } from "../validators/category.validator";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createCategoryValidator,
  categoryController.create
);

export default router;
