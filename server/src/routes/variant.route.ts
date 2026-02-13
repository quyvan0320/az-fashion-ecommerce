import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
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

route.get("/:id", variantIdValidator, variantController.getVariantById);

export default route;
