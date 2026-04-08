import { OrderStatus } from "@prisma/client";
import prisma from "../config/prisma";
import {
  CreateOrderInput,
  GetOrderQuery,
  UpdateOrderStatusInput,
} from "../interfaces/order.interface";
import { AppError } from "../middleware/errorHandler";
import { generateOrderNumber } from "../utils/string.util";

export const orderService = {
  async create(userId: string, data: CreateOrderInput) {
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
        variant: true,
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

      const currentStock = item.variant?.stock ?? item.product.stock;
      if (currentStock < item.quantity) {
        issues.push(
          `${item.product.name} (${item.variant?.size || "Mặc định"}): Chỉ còn ${currentStock} sản phẩm.`,
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
    const orderItemsData = cartItems.map((item) => {
      const price =
        item.variant?.price || item.product.salePrice || item.product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      return {
        productId: item.productId,
        variantId: item.variantId,
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
            create: orderItemsData,
          },
        },
        include: {
          items: { include: { product: true, variant: true } },
          address: true,
        },
      });

      for (const item of cartItems) {
        if (item.variantId) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
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
        totalPages: Math.ceil(total / limit),
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

  // get all orders from admin
  async getAllOrders(query: GetOrderQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
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
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
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
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  },

  // update status order admin
  async updateOrderStatus(orderId: string, data: UpdateOrderStatusInput) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }

    // validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.PROCESSING, OrderStatus.CANCELED],
      PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELED],
      SHIPPED: [OrderStatus.DELIVERED],
      DELIVERED: [],
      CANCELED: [],
    };

    const allowedStatuses = validTransitions[order.status];

    if (!allowedStatuses.includes(data.status)) {
      throw new AppError(
        `Không thể thay đổi trạng thái từ ${order.status} thành ${data.status}`,
        400,
      );
    }

    // generate tracking number when SHIPPED
    const trackingNumber =
      data.status === OrderStatus.SHIPPED
        ? generateOrderNumber()
        : order.trackingNumber;

    // Update payment status when DELIVERED
    const paymentStatus =
      data.status === OrderStatus.DELIVERED ? "PAID" : order.paymentStatus;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: data.status,
        trackingNumber,
        paymentStatus,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });

    return updated;
  },

  // get  order stats admin
  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrder,
      deliveredOrder,
      canceledOrder,
      totalRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
      prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
      prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      prisma.order.count({ where: { status: OrderStatus.CANCELED } }),
      prisma.order.aggregate({
        where: { status: { not: OrderStatus.CANCELED } },
        _sum: { total: true },
      }),
    ]);

    // recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    return {
      totalOrders,
      orderByStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrder,
        delivered: deliveredOrder,
        canceled: canceledOrder,
      },
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
    };
  },
};
