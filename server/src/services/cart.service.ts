import prisma from "../config/prisma";
import { AppError } from "../middleware/errorHandler";

export const cartService = {
  async addItem(
    userId: string,
    productId: string,
    variantId: string,
    quantity: number = 1,
  ) {
    if (quantity < 1) {
      throw new AppError("Số lượng phải ít nhất là 1", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          where: { id: variantId },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new AppError(
        "Sản phẩm không tồn tại hoặc đã ngừng kinh doanh",
        400,
      );
    }

    const selectedVariant = product.variants[0];
    if (!selectedVariant) {
      throw new AppError("Biến thể (Size/Màu) này không tồn tại", 400);
    }

    const currentStock = selectedVariant.stock;
    if (currentStock < quantity) {
      throw new AppError(
        `Kho chỉ còn ${currentStock} sản phẩm cho lựa chọn này`,
        400,
      );
    }

    const existingCart = await prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: { userId, productId, variantId },
      },
    });

    if (existingCart) {
      const newQuantity = existingCart.quantity + quantity;

      if (newQuantity > currentStock) {
        const canAddMore = currentStock - existingCart.quantity;
        throw new AppError(
          canAddMore <= 0
            ? `Bạn đã có ${existingCart.quantity} món (đạt tối đa tồn kho của size này).`
            : `Bạn chỉ có thể thêm tối đa ${canAddMore} sản phẩm nữa cho size này.`,
          400,
        );
      }

      return await prisma.cartItem.update({
        where: { id: existingCart.id },
        data: { quantity: newQuantity },
        include: {
          product: { select: { id: true, name: true, images: true } },
          variant: true,
        },
      });
    }

    return await prisma.cartItem.create({
      data: { userId, productId, variantId, quantity },
      include: {
        product: { select: { id: true, name: true, images: true } },
        variant: true,
      },
    });
  },

  // get cart
  async getCart(userId: string) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            images: true,
            stock: true,
            isActive: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = cartItems.map((item) => {
      const basePrice =
        item.variant?.price || item.product.salePrice || item.product.price;
      const subtotal = basePrice * item.quantity;

      return {
        id: item.id,
        quantity: item.quantity,
        product: item.product,
        variant: item.variant,
        price: basePrice,
        subtotal,
      };
    });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      summary: {
        total,
        itemCount,
        totalQuantity,
      },
    };
  },

  // update cart
  async updateQuantity(userId: string, itemId: string, quantity: number) {
    // check validate quantity
    if (quantity < 1) {
      throw new AppError("Số lượng phải ít nhất là 1", 400);
    }

    // check cart exist from user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new AppError("Mặt hàng không tìm thấy", 404);
    }

    // check stock
    if (cartItem.product.stock < quantity) {
      throw new AppError(
        `Chỉ còn ${cartItem.product.stock} sản phẩm trong kho`,
        400,
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            images: true,
            stock: true,
          },
        },
      },
    });
    return updated;
  },

  // remove item from cart
  async removeItem(userId: string, itemId: string) {
    // check cart exist from userId
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!cartItem) {
      throw new AppError("Mặt hàng không tồn tại", 404);
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });
    return { message: "Sản phẩm đã được xóa khỏi giỏ hàng" };
  },

  // clear cart
  async clearItem(userId: string) {
    await prisma.cartItem.deleteMany({
      where: { userId },
    });
    return { message: "Giỏ hàng đã được xóa" };
  },

  // validate cart before checkout
  async validateCart(userId: string) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new AppError("Giỏ hàng trống", 400);
    }

    const issues: string[] = [];
    for (const item of cartItems) {
      // Check product still active
      if (!item.product.isActive) {
        issues.push(`Sản phẩm ${item.product.name} hiện không có sẵn`);
        continue;
      }

      // check stock
      if (item.product.stock < item.quantity) {
        issues.push(
          `${item.product.name}: Chỉ còn ${item.product.stock} sản phẩm trong giỏ hàng (hiện bạn đang có ${item.quantity} số lượng trong giỏ hàng)`,
        );
      }
    }
    if (issues.length > 0) {
      throw new AppError(
        "Giỏ hàng không đủ điều kiện thanh toán: " + issues.join("; "),
        400,
      );
    }

    return { valid: true };
  },

  async getCartSummary(userId: string) {
    const { items, summary } = await this.getCart(userId);

    //validate cart
    await this.validateCart(userId);

    // calculate shipping
    const shippingCost = summary.total > 500000 ? 0 : 30000;

    // calculate tax
    const tax = Math.round(summary.total * 0.1);

    const finalTotal = summary.total + shippingCost + tax;

    return {
      items,
      subtotal: summary.total,
      shippingCost,
      tax,
      total: finalTotal,
      itemCount: summary.itemCount,
      totalQuantity: summary.totalQuantity,
    };
  },
};
