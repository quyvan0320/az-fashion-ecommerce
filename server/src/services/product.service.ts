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

  // get all by search filter and sort
  async getAll(query: GetProductsQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    // build where clause
    const where: Prisma.ProductWhereInput = {};

    // search name & description
    if (query.search) {
      where.OR = [
        {
          name: { contains: query.search, mode: "insensitive" },
          description: { contains: query.search, mode: "insensitive" },
        },
      ];
    }

    // filter category
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    // filter price range
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = Number(query.maxPrice);
      }
    }

    // filter  stock
    if (query.inStock === true) {
      where.stock = { gt: 0 };
    }

    // filter active status
    if (query.isActive !== undefined) {
      where.isActive = query.isActive === true;
    }

    // build orderby
    const sortBy = query.sortBy || "createdAt";
    const order = query.order || "desc";
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: order,
    };

    // get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              variants: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // get list id 20 products
    const productIds = products.map((p) => p.id);

    // calculate avg  all  product
    const stats = await prisma.review.groupBy({
      by: ["productId"],
      where: { productId: { in: productIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // index product
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
    // check product exist
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Sản phẩm không tồn tại", 404);
    }

    // validate category
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new AppError("Danh mục không tồn tại", 404);
      }
    }

    // new slug if name changed
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

    // check SKU unique changed
    if (data.sku && data.sku !== product.sku) {
      const existingSKU = await prisma.product.findUnique({
        where: { sku: data.sku, NOT: { id } },
      });

      if (existingSKU) {
        throw new AppError("SKU đã tồn tại", 400);
      }
    }

    // validate price
    const price = data.price ?? product.price;
    const salePrice = data.salePrice ?? product.salePrice;

    if (salePrice && salePrice >= price) {
      throw new AppError("Mức giảm giá phải thấp hơn giá mặc định", 400);
    }

    // update
    return prisma.product.update({
      where: { id },
      data: {
        ...data,
        slug,
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
};
