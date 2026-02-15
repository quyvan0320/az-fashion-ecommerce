import { Role } from "@prisma/client";
import { query } from "express-validator";

export const anylyticsValidator = [
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Ngày chỉ được nằm khoản 1 đến 365"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage("Tối đa chỉ được nằm khoản 1 đến 30"),

  query("threshold")
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage("Ngưỡng chỉ được nằm khoản 1 đến 30"),
];

export const getUsersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Trang phải là 1 số nguyên dương"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Tối đa trong khoản 1 đến 100"),

  query("role")
    .optional()
    .isIn(Object.values(Role))
    .withMessage("Vai trò không hợp lệ"),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Tìm kiếm không được vượt quá 100 ký tự"),
];
