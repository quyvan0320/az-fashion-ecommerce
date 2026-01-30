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
      throw new AppError(`Chỉ có ${product.stock} có sẵn trong kho`, 400);
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
          `Không thể thêm số lượng ${quantity} nữa. Chỉ ${product.stock - existingCart.quantity}`,
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
};
