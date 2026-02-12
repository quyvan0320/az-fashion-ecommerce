import prisma from "../config/prisma";
import { CreateVariantInput } from "../interfaces/variant.interface";
import { AppError } from "../middleware/errorHandler";
import { generateVariantSKU } from "../utils/string.util";

export const variantService = {
  async createVariant(productId: string, data: CreateVariantInput) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }

    // validate required size or color
    if (!data.size && !data.color) {
      throw new AppError("Biến thể phải có ít nhất màu sắc và kích thước", 400);
    }

    if (data.size || data.color) {
      const existing = await prisma.variant.findFirst({
        where: {
          productId,
          ...(data.size && { size: data.size }),
          ...(data.color && { color: data.color }),
        },
      });

      if (existing) {
        throw new AppError(
          `Biến thể có ${data.size || ""} ${data.color || ""} đã tồn tại`,
          400,
        );
      }
    }

    const sku =
      data.sku || generateVariantSKU(product.sku, data.size, data.color);

    // check sku unique
    const existingSKU = await prisma.variant.findUnique({
      where: { sku },
    });

    if (existingSKU) {
      throw new AppError("SKU đã tồn tại", 400);
    }

    // create variant

    const variant = await prisma.variant.create({
      data: {
        productId,
        size: data.size,
        color: data.color,
        price: data.price,
        stock: data.stock,
        sku,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return variant;
  },
};
