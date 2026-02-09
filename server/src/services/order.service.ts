import { OrderStatus } from "@prisma/client";
import prisma from "../config/prisma";
import { CreateOrderInput, GetOrderQuery } from "../interfaces/order.interface";
import { AppError } from "../middleware/errorHandler";
import { generateOrderNumber } from "../utils/string.util";

export const orderService = {
  async create(userId: string, data: CreateOrderInput) {
    console.log("---------- DEBUG CHECK ----------");
    console.log("1. UserId từ Token:", userId);
    console.log("2. AddressId từ Body:", data.addressId);

    // Thử tìm riêng lẻ để xem thằng nào sai
    const checkUser = await prisma.user.findUnique({ where: { id: userId } });
    const checkAddressOnly = await prisma.address.findUnique({
      where: { id: data.addressId },
    });

    console.log("3. User này có tồn tại ko?:", !!checkUser);
    console.log("4. AddressId này có tồn tại ko?:", !!checkAddressOnly);
    if (checkAddressOnly) {
      console.log(
        "5. Address này thực tế thuộc về User nào?:",
        checkAddressOnly.userId,
      );
    }
    console.log("---------------------------------");
    // validate exist address belong user
    const address = await prisma.address.findFirst({
      where: {
        id: data.addressId,
        userId,
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

  async getMyOrders(userId: string, query: GetOrderQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.status) {
      where.status = query.status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  },

  async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
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

    if (!order) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }

    return order;
  },
  async getOrderByNumber(userId: string, orderNumber: string) {
    const order = await prisma.order.findFirst({
      where: { orderNumber, userId },
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

    if (!order) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }

    return order;
  },

  async cancelOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }

    // just cancel then PENDING or PROCESSING
    if (!["PENDING", "PROCESSING"].includes(order.status)) {
      throw new AppError(
        `Không thể hủy đơn hàng với trạng thái ${order.status}`,
        400,
      );
    }

    // cancel order + restore stock
    const canceledOrder = await prisma.$transaction(async (tx) => {
      // update order status

      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELED, paymentStatus: "REFUNDED" },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return updated;
    });
    return canceledOrder;
  },
};
