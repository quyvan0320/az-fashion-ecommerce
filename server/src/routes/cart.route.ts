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

// update quantity
router.put(
  "/items/:id",
  updateQuantityValidator,
  cartController.updateQuantity,
);

// update quantity
router.delete(
  "/items/:id",
  cartItemIdValidator,
  cartController.removeItem,
);
// add quantiy
router.post("/items", addItemValidator, cartController.addItem);


export default router;
