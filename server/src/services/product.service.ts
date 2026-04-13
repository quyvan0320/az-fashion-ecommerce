import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import {
  CreateProductInput,
  GetProductsQuery,
  UpdateProductInput,
} from "../interfaces/product.interface";
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

    const price = Number(data.price);
    const salePrice = data.salePrice ? Number(data.salePrice) : 0;

    if (salePrice > 0 && salePrice >= price) {
      throw new AppError(
        "Mức giảm giá phải thấp hơn mức giá thông thường",
        400,
      );
    }

    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        images: data.images,
        categoryId: data.categoryId,
        brand: data.brand,
        price: price,
        salePrice: salePrice,
        stock: Number(data.stock || 0),
        isActive: Boolean(data.isActive),
        slug: finalSlug,
        sku: sku,
      },
      include: {
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  },

  // get all by search filter and sort
  async getAll(query: GetProductsQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { brand: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    } else if (query.categorySlug) {
      where.category = { slug: query.categorySlug };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {
        gte: query.minPrice ? Number(query.minPrice) : 0,
        lte: query.maxPrice ? Number(query.maxPrice) : 3000000,
      };
    }

    if (query.isAdmin !== "true") {
      where.isActive = true;
    }

    if (query.isSale === "true") {
      where.AND = [
        {
          salePrice: {
            gt: 0,
          },
        },
        {
          salePrice: {
            lt: prisma.product.fields.price,
          },
        },
      ];
    }

    if (query.size || query.color) {
      where.variants = {
        some: {
          AND: [
            query.size ? { size: query.size } : {},
            query.color ? { color: query.color } : {},
            { stock: { gt: 0 } },
          ],
        },
      };
    }

    const sortBy = query.sortBy || "createdAt";
    const order = query.order || "desc";

    const validSortFields = ["name", "price", "createdAt"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [finalSortBy]: order,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          variants: true,
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { reviews: true, variants: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const productIds = products.map((p) => p.id);
    const stats = await prisma.review.groupBy({
      by: ["productId"],
      where: { productId: { in: productIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const statsMap = new Map(stats.map((s) => [s.productId, s]));

    const productWithRating = products.map((product) => {
      const s = statsMap.get(product.id);
      return {
        ...product,
        averageRating: s?._avg.rating || 0,
        reviewCount: s?._count.rating || 0,
        variantCount: product._count.variants,
      };
    });

    return {
      products: productWithRating,
      pagination: page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  },

  // get by id
  async getById(id: string) {
    // check exist product
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }

    // calculate avg rating
    const avgRating = await prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
    });

    return {
      ...product,
      averageRating: avgRating._avg.rating || 0,
      reviewCount: product._count.reviews,
    };
  },

  // get by slug
  async getBySlug(slug: string) {
    // check exist product
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }

    // calculate avg rating
    const avgRating = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
    });

    return {
      ...product,
      averageRating: avgRating._avg.rating || 0,
    };
  },

  // get product by query
  async getByCategory(categoryId: string, query: GetProductsQuery) {
    return this.getAll({ ...query, categoryId });
  },

  async update(id: string, data: UpdateProductInput) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new AppError("Danh mục không tồn tại", 404);
      }
    }

    let slug = product.slug;
    if (data.name && data.name !== product.name) {
      slug = generateSlug(data.name);
      const existingSlug = await prisma.product.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    if (data.sku && data.sku !== product.sku) {
      const existingSKU = await prisma.product.findUnique({
        where: { sku: data.sku, NOT: { id } },
      });
      if (existingSKU) {
        throw new AppError("SKU đã tồn tại", 400);
      }
    }

    const currentPrice =
      data.price !== undefined ? Number(data.price) : (product.price ?? 0);
    const currentSalePrice =
      data.salePrice !== undefined
        ? Number(data.salePrice)
        : (product.salePrice ?? 0);

    if (currentSalePrice > 0 && currentSalePrice >= currentPrice) {
      throw new AppError("Mức giảm giá phải thấp hơn giá mặc định", 400);
    }

    return await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          ...data,
          price: data.price !== undefined ? Number(data.price) : undefined,
          salePrice:
            data.salePrice !== undefined ? Number(data.salePrice) : undefined,
          stock: data.stock !== undefined ? Number(data.stock) : undefined,
          isActive:
            data.isActive !== undefined ? Boolean(data.isActive) : undefined,
          slug: slug,
        },
        include: {
          variants: true,
          category: { select: { id: true, name: true, slug: true } },
        },
      });

      if (data.price !== undefined || data.salePrice !== undefined) {
        const sPrice = updatedProduct.salePrice ?? 0;
        const pPrice = updatedProduct.price;
        const newEffectivePrice = sPrice > 0 ? sPrice : pPrice;

        await tx.variant.updateMany({
          where: { productId: id },
          data: { price: newEffectivePrice },
        });
      }

      return updatedProduct;
    });
  },

  // delete product
  async delete(id: string) {
    // check product exist
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }

    // prevent delete if product has order
    if (product._count.orderItems > 0) {
      throw new AppError("Không thể xóa với sản phẩm có đơn đặt hàng", 400);
    }

    return prisma.product.delete({ where: { id } });
  },

  //update stock
  async updateStock(id: string, quantity: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new AppError("Không đủ hàng", 400);
    }

    return prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
  },

  // toggle active
  async toggleActive(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
  },

  // product for homepage
  async getFeatured(limit: number = 8) {
    return prisma.product.findMany({
      where: { isActive: true },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        variants: true,
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

  // get related product same category
  async getRelated(productId: string, limit: number = 4) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }

    return prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        NOT: { id: productId },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        variants: true,
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
