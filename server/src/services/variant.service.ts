import prisma from "../config/prisma";
import {
  CreateVariantInput,
  UpdateVariantInput,
} from "../interfaces/variant.interface";
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

  async updateVariant(variantId: string, data: UpdateVariantInput) {
    // check variants exist
    const variant = await prisma.variant.findFirst({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new AppError("Biến thể không tồn tại", 404);
    }
    let newSku = data.sku;
    // check duplicate variant if update size/color
    if (data.size !== undefined || data.color !== undefined) {
      const newSize = data.size !== undefined ? data.size : variant.size;
      const newColor = data.color !== undefined ? data.color : variant.color;

      const existing = await prisma.variant.findFirst({
        where: {
          productId: variant.productId,
          size: newSize,
          color: newColor,
          NOT: { id: variantId },
        },
      });

      if (existing) {
        throw new AppError(
          `Biến thể có ${newSize || ""} ${newColor || ""} đã tồn tại`,
          400,
        );
      }

      // NẾU Admin KHÔNG tự nhập SKU mới, mình tự generate lại SKU theo Size/Color mới
      if (!data.sku) {
        newSku = generateVariantSKU(
          variant.product.sku,
          newSize ?? undefined,
          newColor ?? undefined,
        );
      }
    }

    // check UKU unique if update SKU
    if (data.sku && data.sku !== variant.sku) {
      const existingSKU = await prisma.variant.findFirst({
        where: { sku: data.sku },
      });

      if (existingSKU) {
        throw new AppError("SKU đã tồn tại", 400);
      }
    }

    const updated = await prisma.variant.update({
      where: { id: variantId },
      data: {
        ...data,
        sku: newSku,
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

    return updated;
  },
};
