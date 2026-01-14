import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { AppError } from "../middleware/errorHandler";

export const authService = {
  // register new user
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    // checke if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Nguời dùng đã tồn tại", 400);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // create new user in database
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        // get selected fields only
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as any
    );
    return { user, token };
  },

  // login user
  async login(email: string, password: string) {
    // find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Thông tin đăng nhập không hợp lệ", 401);
    }

    //compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Thông tin đăng nhập không hợp lệ", 401);
    }

    // generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as any
    );

    // remove password from user object
    const { password: _, ...userWhitoutPassword } = user;

    return { user: userWhitoutPassword, token };
  },
};
