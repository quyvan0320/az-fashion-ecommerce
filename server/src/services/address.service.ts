import prisma from "../config/prisma";
import { CreateAddressInput } from "../interfaces/address.interface";

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
};
