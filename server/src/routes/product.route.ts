import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  categoryIdValidator,
  createProductValidator,
  getProductsValidator,
  productIdValidator,
  productSlugValidator,
  updateProductValidator,
} from "../validators/product.validator";
import { productController } from "../controllers/product.controller";

const router = Router();

// admin create
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createProductValidator,
  productController.create,
);


// admin update
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateProductValidator,
  productController.update,
);

// get all
router.get("/", getProductsValidator, productController.getAll);

// get by id
router.get("/:id", productIdValidator, productController.getById);

// get by slug
router.get("/slug/:slug", productSlugValidator, productController.getBySlug);

// get by category
router.get(
  "/category/:categoryId",
  categoryIdValidator,
  getProductsValidator,
  productController.getByCategory,
);

export default router;
