import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createOrderValidator } from "../validators/order.validator";
import { orderController } from "../controllers/order.controller";

const router = Router();

router.post("/", authenticate, createOrderValidator, orderController.create);

export default router;
