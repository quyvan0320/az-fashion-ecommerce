import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  createProductValidator,
  getProductsValidator,
  productIdValidator,
  productSlugValidator,
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

// get all
router.get("/", getProductsValidator, productController.getAll);

// get by id
router.get("/:id", productIdValidator, productController.getById);


// get by slug
router.get("/slug/:slug", productSlugValidator, productController.getBySlug);

export default router;
