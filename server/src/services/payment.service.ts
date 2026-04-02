import Stripe from "stripe";
import prisma from "../config/prisma";
import { AppError } from "../middleware/errorHandler";
import { stripe } from "../utils/string.util";
import { OrderStatus } from "@prisma/client";

export const paymentService = {
  async createPaymentIntent(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) throw new AppError("Đơn hàng không tồn tại", 404);
    if (order.paymentStatus === "PAID")
      throw new AppError("Đơn hàng đã được thanh toán", 400);

    const amountInCents = Math.round((order.total / 25000) * 100); // VND -> USD
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "USD",
      metadata: {
        orderId: order.id,
        userId,
        orderNumber: order.orderNumber,
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentMethod: "STRIPE" },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents,
    };
  },

  verifyWebhookEvent(rawBody: Buffer, signature: string, secret: string) {
    return stripe.webhooks.constructEvent(rawBody, signature, secret);
  },

  async processWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { orderId } = paymentIntent.metadata;

        return await prisma.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.PROCESSING,
            paymentStatus: "PAID",
            paymentMethod: "STRIPE",
          },
        });
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { orderId } = paymentIntent.metadata;
        return await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "FAILED",
          },
        });
      }
      default:
        console.log(`Sự kiện chưa xử lý ${event.type}`);
    }
  },
};
