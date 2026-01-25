import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { createProductValidator } from "../validators/product.validator";
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

export default router;
