import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import {
  categoryIdParamValidator,
  categorySlugParamValidator,
  createCategoryValidator,
  getCategoriesValidator,
  updateCategoryValidator,
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

// update
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateCategoryValidator,
  categoryController.update,
);

// delete
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryIdParamValidator,
  categoryController.delete,
);

// stats
router.get(
  "/admin/stats",
  authenticate,
  authorize("ADMIN"),
  categoryController.getStats,
);

// get by id
router.get("/:id", categoryIdParamValidator, categoryController.getById);
// get by slug
router.get(
  "/slug/:slug",
  categorySlugParamValidator,
  categoryController.getBySlug,
);

//get all
router.get("/", getCategoriesValidator, categoryController.getAll);

export default router;
