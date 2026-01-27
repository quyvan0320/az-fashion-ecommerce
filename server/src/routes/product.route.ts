import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  categoryIdValidator,
  createProductValidator,
  getProductsValidator,
  productIdValidator,
  productSlugValidator,
  updateProductValidator,
  updateStockValidator,
} from "../validators/product.validator";
import { productController } from "../controllers/product.controller";

const router = Router();

// get featured
router.get("/featured", productController.getFeatured);

// get all
router.get("/", getProductsValidator, productController.getAll);

// admin create
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createProductValidator,
  productController.create,
);

// get by category
router.get(
  "/category/:categoryId",
  categoryIdValidator,
  getProductsValidator,
  productController.getByCategory,
);

// get by slug
router.get("/slug/:slug", productSlugValidator, productController.getBySlug);

// admin update stock
router.patch(
  "/:id/stock",
  authenticate,
  authorize("ADMIN"),
  updateStockValidator,
  productController.updateStock,
);

// admin toggle active
router.patch(
  "/:id/toggle-active",
  authenticate,
  authorize("ADMIN"),
  productIdValidator,
  productController.toggleActive,
);

// get related
router.get("/:id/related", productIdValidator, productController.getRelated);

// admin update
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateProductValidator,
  productController.update,
);

// admin delete
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productIdValidator,
  productController.delete,
);

// admin delete
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productIdValidator,
  productController.delete,
);

// get by id
router.get("/:id", productIdValidator, productController.getById);

export default router;
