import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  updateStockVariantValidator,
  updateVariantValidator,
  variantIdValidator,
} from "../validators/variant.validator";
import { variantController } from "../controllers/variant.controller";

const route = Router();

route.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateVariantValidator,
  variantController.updateVariant,
);

route.patch(
  "/:id/stock",
  authenticate,
  authorize("ADMIN"),
  updateStockVariantValidator,
  variantController.updateStock,
);

route.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  variantIdValidator,
  variantController.deleteVariant,
);


route.get("/:id", variantIdValidator, variantController.getVariantById);

export default route;
