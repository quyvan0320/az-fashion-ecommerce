// generate category slug

import prisma from "../config/prisma";
import { AppError } from "../middleware/errorHandler";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics;
    .replace(/[đĐ/]/g, "d") // replace đ and Đ
    .replace(/[^a-z0-9\s-]+/g, "") // replace non-alphanumeric characters with hyphens
    .trim()
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // replace multiple hyphens with single hyphen
};

interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
}

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
};
