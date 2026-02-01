import prisma from "../config/prisma";

export const addressService = {
  // get all address of user
  async getAll(userId: string) {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return addresses;
  },
};
