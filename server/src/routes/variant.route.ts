import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { updateVariantValidator } from "../validators/variant.validator";
import { variantController } from "../controllers/variant.controller";

const route = Router();

route.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateVariantValidator,
  variantController.updateVariant,
);

export default route;
