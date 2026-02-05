import prisma from "../config/prisma";
import { CreateOrderInput } from "../interfaces/order.interface";
import { AppError } from "../middleware/errorHandler";
import { generateOrderNumber } from "../utils/string.util";

export const orderService = {
  async create(userId: string, data: CreateOrderInput) {
    // validate exist address belong user
    const address = await prisma.address.findFirst({
      where: {
        userId,
        id: data.addressId,
      },
    });

    if (!address) {
      throw new AppError("Địa chỉ không tồn tại", 404);
    }

    // get cart item
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new AppError("Giỏ hàng trống", 400);
    }

    // validate cart
    const issues: string[] = [];
    for (const item of cartItems) {
      if (!item.product.isActive) {
        issues.push(`Sản phẩm ${item.product.name} hiện không có sẵn`);
        continue;
      }

      if (item.product.stock < item.quantity) {
        issues.push(
          `${item.product.name}: Chỉ còn ${item.product.stock} sản phẩm trong giỏ hàng (hiện bạn đang có ${item.quantity} số lượng trong giỏ hàng)`,
        );
      }
    }

    if (issues.length > 0) {
      throw new AppError(
        "Giỏ hàng không đủ điều kiện: " + issues.join("; "),
        400,
      );
    }

    // calculate totals
    let subtotal = 0;
    const orderItems = cartItems.map((item) => {
      const price = item.product.salePrice || item.product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      };
    });

    const shippingCost = subtotal > 500000 ? 0 : 30000;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shippingCost + tax;

    // generate order number
    const orderNumber = generateOrderNumber();

    // (transaction)
    const order = await prisma.$transaction(async (tx) => {
      // create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: data.addressId,
          subtotal,
          shippingCost,
          tax,
          total,
          paymentMethod: data.paymentMethod,
          paymentStatus: "PENDING",
          notes: data.notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
          address: true,
        },
      });

      // decrease stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // clear cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    return order;
  },
};
