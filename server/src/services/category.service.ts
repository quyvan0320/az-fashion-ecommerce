// generate category slug

import prisma from "../config/prisma";
import { AppError } from "../middleware/errorHandler";
import { generateSlug } from "../utils/string.util";
import { CreateCategoryInput, UpdateCategoryInput, GetCategoriesInput } from "../interfaces/category.interface";





export const categoryService = {
  // create new category
  async create(data: CreateCategoryInput) {
    // create slug from name
    const slug = generateSlug(data.name);

    //check if category with same slug already exists
    const existingSlug = await prisma.category.findUnique({
      where: { slug },
    });

    // add timestamp unique

    if (existingSlug) {
      const uniqueSlug = `${slug}-${Date.now()}`;
      return prisma.category.create({
        data: {
          ...data,
          slug: uniqueSlug,
        },
      });
    }

    // check existing name
    const existingName = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      throw new AppError("Danh muc đã tồn tại", 400);
    }
    return prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });
  },

  // get all categories with pagination and search
  async getAll(query: GetCategoriesInput) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || "";

    // if where search is provided
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // get category with total count
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.category.count({ where }),
    ]);

    return {
      categories,
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

  // get category by id
  async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
        products: {
          take: 10, // get only 10 products
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            salePrice: true,
            stock: true,
          },
        },
      },
    });

    if (!category) {
      throw new AppError("Danh mục không tồn tại", 404);
    }

    return category;
  },

  // get category by slug
  async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    if (!category) {
      throw new AppError("Danh mục không tồn tại", 404);
    }

    return category;
  },

  // update category
  async update(id: string, data: UpdateCategoryInput) {
    // check existing category
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError("Danh mục không tồn tại", 404);
    }

    // name update, generate new slug
    let slug = category.slug;
    if (data.name && data.name !== category.name) {
      slug = generateSlug(data.name);

      // check if slug already exists
      const existingSlug = await prisma.category.findUnique({
        where: { slug, NOT: { id } },
      });

      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }

      // check existing name
      const existingName = await prisma.category.findUnique({
        where: { name: data.name, NOT: { id } },
      });

      if (existingName) {
        throw new AppError("Danh mục đã tồn tại", 400);
      }
    }

    return prisma.category.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });
  },

  // delete category
  async delete(id: string) {
    // check existing category
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new AppError("Danh mục không tồn tại", 404);
    }

    // if has products, cannot delete
    if (category._count.products > 0) {
      throw new AppError(
        `Không thể xóa danh mục có sản phẩm ${category._count.products}. Vui lòng xóa hoặc chuyển các sản phẩm trong danh mục này trước`,
        400,
      );
    }

    return prisma.category.delete({ where: { id } });
  },

  // get stats
  async getStats() {
    const [totalCategories, categoriesWithProducts] = await Promise.all([
      prisma.category.count(),
      prisma.category.count({
        where: {
          products: {
            some: {},
          },
        },
      }),
    ]);

    // top 5 categories by number of products
    const topCategories = await prisma.category.findMany({
      take: 5,
      orderBy: {
        products: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      totalCategories,
      categoriesWithProducts,
      emptyCategories: totalCategories - categoriesWithProducts,
      topCategories: topCategories.map((cate) => ({
        id: cate.id,
        name: cate.name,
        productCount: cate._count.products,
      })),
    };
  },
};
