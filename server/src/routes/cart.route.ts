import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { addItemValidator } from "../validators/cart.validator";
import { cartController } from "../controllers/cart.controller";

const router = Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/items", addItemValidator, cartController.addItem);

export default router;
