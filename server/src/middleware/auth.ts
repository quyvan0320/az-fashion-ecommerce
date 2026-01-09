import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

interface JwtPayload {
  userId: string;
  role: string;
}

// extend express request type have req.user global
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// middleware check jwt token

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get token from header authorization bearer token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("Không có token, truy cập bị từ chối", 401);
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWt_SECRET as string
    ) as JwtPayload;

    // user info into req.user
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Token không hợp lệ hoặc đã hết hạn", 401));
  }
};

// middleware check admin role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("Bạn không có quyền truy cập tài nguyên này", 403)
      );
    }
    next();
  };
};
