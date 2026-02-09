import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createOrderValidator,
  getOrdersValidator,
  orderIdValidator,
  orderNumberParamValidator,
} from "../validators/order.validator";
import { orderController } from "../controllers/order.controller";

const router = Router();

router.post("/", authenticate, createOrderValidator, orderController.create);

router.get("/", authenticate, getOrdersValidator, orderController.getMyOrders);

router.get(
  "/:id",
  authenticate,
  orderIdValidator,
  orderController.getOrderById,
);


router.get(
  "/number/:orderNumber",
  authenticate,
  orderNumberParamValidator,
  orderController.getOrderByNumber,
);


router.get(
  "/:id/cancel",
  authenticate,
  orderIdValidator,
  orderController.cancelOrder,
);


export default router;
