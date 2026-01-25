import prisma from "../config/prisma";
import { CreateProductInput } from "../interfaces/product.interface";
import { AppError } from "../middleware/errorHandler";
import { generateSKU, generateSlug } from "../utils/string.util";

export const productService = {
  //create product
  async create(data: CreateProductInput) {
    // check category exists
    const categoryId = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!categoryId) {
      throw new AppError("Danh mục không tồn tại", 404);
    }

    // generate slug
    const slug = generateSlug(data.name);

    // check slug unique
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    // generate SKU if not provide
    const sku = data.sku || generateSKU(data.name, data.categoryId);

    // check unique SKU
    const existingSKU = await prisma.product.findUnique({
      where: { sku },
    });
    if (existingSKU) {
      throw new AppError("Mã sản phẩm đã tồn tại", 400);
    }

    // validate sale price
    if (data.salePrice && data.salePrice >= data.price) {
      throw new AppError(
        "Mức giảm giá phải thấp hơn mức giá thông thường",
        400,
      );
    }

    //create
    return prisma.product.create({
      data: {
        ...data,
        slug: finalSlug,
        sku,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  },
};
