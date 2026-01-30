import prisma from "../config/prisma";
import { AppError } from "../middleware/errorHandler";

export const cartService = {
  async addItem(userId: string, productId: string, quantity: number = 1) {
    // validate quantity
    if (quantity < 1) {
      throw new AppError("Số lượng phải ít nhất là 1", 400);
    }

    // check exist
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 400);
    }

    if (!product.isActive) {
      throw new AppError("Sản phẩm không có sẵn", 400);
    }

    // check stock
    if (product.stock < quantity) {
      throw new AppError(
        `Chỉ còn ${product.stock} sản phẩm có sẵn trong kho`,
        400,
      );
    }

    // check if item already in cart
    const existingCart = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingCart) {
      // update quantity if has
      const newQuantity = existingCart.quantity + quantity;

      // check new stock for new quantity
      if (product.stock < newQuantity) {
        throw new AppError(
          `Không thể thêm số lượng ${quantity} sản phẩm nữa. Chỉ còn ${product.stock - existingCart.quantity} sản phẩm trong kho`,
          400,
        );
      }

      const updated = await prisma.cartItem.update({
        where: { id: existingCart.id },
        data: { quantity: newQuantity },
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
    }

    //create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
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

    return cartItem;
  },

  // get cart
  async getCart(userId: string) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
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

    // calculate subtotal for each item and total
    const items = cartItems.map((item) => {
      const price = item.product.salePrice || item.product.price;
      const subtotal = price * item.quantity;

      return {
        id: item.id,
        quantity: item.quantity,
        product: item.product,
        price,
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
};
