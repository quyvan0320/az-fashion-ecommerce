import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  addItemValidator,
  cartItemIdValidator,
  updateQuantityValidator,
} from "../validators/cart.validator";
import { cartController } from "../controllers/cart.controller";

const router = Router();

router.use(authenticate);
// get cart
router.get("/", cartController.getCart);

// validate cart to checkout
router.post("/validate", cartController.validateCart);

// summary total cart
router.get("/summary", cartController.getCartSummary);

// update quantity
router.put(
  "/items/:id",
  updateQuantityValidator,
  cartController.updateQuantity,
);

// update quantity
router.delete("/items/:id", cartItemIdValidator, cartController.removeItem);
router.delete("/", cartController.clearCart);
// add quantiy
router.post("/items", addItemValidator, cartController.addItem);

export default router;
