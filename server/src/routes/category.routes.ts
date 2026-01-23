import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import {
  categoryIdParamValidator,
  categorySlugParamValidator,
  createCategoryValidator,
  getCategoriesValidator,
} from "../validators/category.validator";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

//create
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createCategoryValidator,
  categoryController.create,
);
// get by id
router.get("/:id", categoryIdParamValidator, categoryController.getById);
// get by slug
router.get("/:slug", categorySlugParamValidator, categoryController.getBySlug);

//get all
router.get("/", getCategoriesValidator, categoryController.getAll);

export default router;
