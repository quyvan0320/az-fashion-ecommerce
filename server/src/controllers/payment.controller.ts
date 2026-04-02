import { Request, Response, NextFunction } from "express";
import { paymentService } from "../services/payment.service";

export const paymentController = {
  async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.body;
      const userId = req.user!.userId;
      const result = await paymentService.createPaymentIntent(orderId, userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      const event = paymentService.verifyWebhookEvent(
        req.body,
        sig,
        webhookSecret,
      );
      await paymentService.processWebhookEvent(event);

      res.status(200).json({
        success: true,
        received: true,
      });
    } catch (error) {
      next(error);
    }
  },
};
