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
import { uploadMultiple } from "../middleware/upload";
import {
  createReviewValidator,
  getProductReviewsValidator,
  reviewIdValidator,
} from "../validators/review.validator";
import { reviewController } from "../controllers/review.controller";
import {
  createVariantValidator,
  productVariantsValidator,
} from "../validators/variant.validator";
import { variantController } from "../controllers/variant.controller";

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
  uploadMultiple as any,
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


// admin update
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  uploadMultiple as any,
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

router.post(
  "/:productId/reviews",
  authenticate,
  createReviewValidator,
  reviewController.createReview,
);

router.get(
  "/:productId/reviews",
  getProductReviewsValidator,
  reviewController.getProductReviews,
);

router.get(
  "/:productId/reviews/can-review",
  authenticate,
  reviewIdValidator,
  reviewController.canReview,
);

router.post(
  "/:productId/variants",
  authenticate,
  authorize("ADMIN"),
  createVariantValidator,
  variantController.createVariant,
);

router.get(
  "/:productId/variants",
  productVariantsValidator,
  variantController.getProductVariants,
);

router.get(
  "/:productId/variants",
  productVariantsValidator,
  variantController.getProductVariants,
);

router.get(
  "/:productId/variants/find",
  productVariantsValidator,
  variantController.findVariant,
);
// get related
router.get("/:id/related", productIdValidator, productController.getRelated);

router.get(
  "/:productId/variants/sizes",
  productVariantsValidator,
  variantController.getProductSizes,
);

router.get(
  "/:productId/variants/colors",
  productVariantsValidator,
  variantController.getProductColors,
);

export default router;
