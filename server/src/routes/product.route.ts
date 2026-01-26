import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  createProductValidator,
  getProductsValidator,
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

export default router;
