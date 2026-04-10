import prisma from "../config/prisma";
import {
  CreateAddressInput,
  UpdateAddressInput,
} from "../interfaces/address.interface";
import { AppError } from "../middleware/errorHandler";

export const addressService = {
  // get all address of user
  async getAll(userId: string) {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return addresses;
  },

  async create(userId: string, data: CreateAddressInput) {
    //if first address , auto set default
    const existingAddresses = await prisma.address.count({
      where: { userId },
    });
    const isDefault = existingAddresses === 0 ? true : data.isDefault || false;

    // if set default = true, unset other address
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // create new address
    const address = await prisma.address.create({
      data: {
        ...data,
        userId,
        isDefault,
      },
    });

    return address;
  },

  async update(userId: string, addressId: string, data: UpdateAddressInput) {
    // check address belong user
    const address = await prisma.address.findFirst({
      where: {
        userId,
        id: addressId,
      },
    });

    if (!address) {
      throw new AppError("Địa chỉ không tồn tại", 404);
    }

    // if set default = true, unset other addresses
    if (data.isDefault === true) {
      await prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
          NOT: {
            id: addressId,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    // unset address
    if (data.isDefault === false && address.isDefault) {
      // check have other address
      const otherAddresses = await prisma.address.count({
        where: {
          userId,
          NOT: {
            id: addressId,
          },
        },
      });

      if (otherAddresses === 0) {
        throw new AppError(
          "Đây là địa chỉ duy nhất của bạn không thể tắt địa chỉ mặc định",
          400,
        );
      }
    }

    const updated = await prisma.address.update({
      where: {
        id: addressId,
      },
      data,
    });

    return updated;
  },

  async getById(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new AppError("Địa chỉ không tồn tại", 404);
    }

    return address;
  },

  async getDefault(userId: string) {
    const address = await prisma.address.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });

    if (!address) {
      throw new AppError("Không có địa chỉ được đặt làm mặc định", 404);
    }

    return address;
  },

  async setDefault(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { userId, id: addressId },
    });

    if (!address) {
      throw new AppError("Địa chỉ không tồn tại", 404);
    }

    if (address.isDefault) {
      return address;
    }

    await prisma.address.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    const updated = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        isDefault: true,
      },
    });
    return updated;
  },

  async delete(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: {
        userId,
        id: addressId,
      },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!address) {
      throw new AppError("Địa chỉ không tồn tại", 404);
    }

    if (address._count.orders > 0) {
      throw new AppError(
        `Không thể xóa địa chỉ với đơn hàng ${address._count.orders}`,
        400,
      );
    }

    if (address.isDefault) {
      const otherAddresses = await prisma.address.findFirst({
        where: { userId, NOT: { id: addressId } },
        orderBy: { createdAt: "desc" },
      });

      if (otherAddresses) {
        await prisma.address.update({
          where: {
            id: otherAddresses.id,
          },
          data: { isDefault: true },
        });
      }
    }

    await prisma.address.delete({ where: { id: addressId } });
    return { message: "Địa chỉ đã được xóa thành công" };
  },
  
};
