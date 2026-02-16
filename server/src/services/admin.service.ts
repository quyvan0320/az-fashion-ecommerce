import { OrderStatus, Role } from "@prisma/client";
import prisma from "../config/prisma";
import { AppError } from "../middleware/errorHandler";

export const adminService = {
  async getDashboard() {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      todayRevenue,
      monthRevenue,
      yearRevenue,
      pendingOrders,
      processingOrders,
      lowStockProduct,
      recentOrders,
    ] = await Promise.all([
      // total counts
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),

      // Total revenue all time
      prisma.order.aggregate({
        where: { status: { not: OrderStatus.CANCELED } },
        _sum: { total: true },
      }),

      // today revenue
      prisma.order.aggregate({
        where: {
          status: { not: OrderStatus.CANCELED },
          createdAt: { gte: startOfToday },
        },
        _sum: { total: true },
      }),

      // month revenue
      prisma.order.aggregate({
        where: {
          status: { not: OrderStatus.CANCELED },
          createdAt: { gte: startOfMonth },
        },
        _sum: { total: true },
      }),

      // this year revenue
      prisma.order.aggregate({
        where: {
          status: { not: OrderStatus.CANCELED },
          createdAt: { gte: startOfYear },
        },
        _sum: { total: true },
      }),

      // pending orders
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),

      // processing orders
      prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),

      // low stock products < 10
      prisma.product.count({ where: { stock: { lt: 10 }, isActive: true } }),

      // recent orders last 10
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      overview: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        todayRevenue: todayRevenue._sum.total || 0,
        monthRevenue: monthRevenue._sum.total || 0,
        yearRevenue: yearRevenue._sum.total || 0,
      },
      orders: {
        pending: pendingOrders,
        processing: processingOrders,
        total: totalOrders,
      },
      alerts: {
        lowStockProduct,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        customer: `${order.user.lastName} ${order.user.firstName}`,
        email: order.user.email,
        createdAt: order.createdAt,
      })),
    };
  },

  async getRevenueAnalytics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        status: { not: OrderStatus.CANCELED },
        createdAt: { gte: startDate },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const revenueByDate: Record<string, number> = {};

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + order.total;
    });

    return Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  },
  async getTopProducts(limit: number = 10) {
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: limit,
    });

    const productsWithDetail = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
        });

        return {
          product,
          totalSold: item._sum.quantity || 0,
          orderCount: item._count.id,
        };
      }),
    );

    return productsWithDetail;
  },

  async getLowStockProducts(threshold: number = 10) {
    const products = await prisma.product.findMany({
      where: {
        stock: { lt: threshold },
        isActive: true,
      },
      orderBy: { stock: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        stock: true,
        sku: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return products;
  },
  async getUserStats() {
    const [totalUsers, totalCustomers, totalAdmins, recentUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: Role.CUSTOMER } }),
        prisma.user.count({ where: { role: Role.ADMIN } }),
        prisma.user.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
          },
        }),
      ]);

    // users per month (last 6 month)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersByMonth = await prisma.user.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: sixMonthsAgo } },
      _count: { id: true },
    });

    return {
      total: totalUsers,
      customers: totalCustomers,
      admins: totalAdmins,
      recentUsers,
      growthData: usersByMonth.map((item) => ({
        month: item.createdAt.toISOString().substring(0, 7),
        count: item._count.id,
      })),
    };
  },
  async getAllUsers(query: {
    page?: string;
    limit?: string;
    role?: string;
    search?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: "insensitive" } },
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
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

  async updateUserRole(userId: string, role: Role) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("Người dùng không tồn tại", 404);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return updated;
  },

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!user) {
      throw new AppError("Người dùng không tồn tại", 404);
    }

    if (user._count.orders > 0) {
      throw new AppError(
        `Không thể xóa người dùng có ${user._count.orders} đơn hàng`,
        400,
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: "Người dùng đã được xóa thành công" };
  },
};
