import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { paymentController } from "../controllers/payment.controller";
import express from "express";

const router = Router();

router.post(
  "/create-intent",
  authenticate,
  paymentController.createPaymentIntent,
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

export default router;
