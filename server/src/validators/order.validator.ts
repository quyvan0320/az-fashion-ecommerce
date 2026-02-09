import { OrderStatus } from "@prisma/client";
import { body, param, query } from "express-validator";

export const createOrderValidator = [
  body("addressId")
    .notEmpty()
    .withMessage("ID địa chỉ không được để trống")
    .isUUID()
    .withMessage("ID địa chỉ không hợp lệ"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Phương thức thanh toán không được để trống")
    .isIn(["COD", "BANK_TRANSFER", "CREDIT_CARD", "MOMO", "ZALOPAY"])
    .withMessage("Phương thức thanh toán không hợp lệ"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Ghi chú không đươc vượt quá 500 ký tự"),
];

export const getOrdersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Trang phải là 1 số nguyên"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Giới hạn phải từ 1 đến 100"),

  query("status")
    .optional()
    .isIn(Object.values(OrderStatus))
    .withMessage("Trạng thái không hợp lệ"),
];

export const orderIdValidator = [
  param("id").isUUID().withMessage("ID đơn hàng không hợp lệ"),
];

export const orderNumberParamValidator = [
  param("orderNumber")
    .trim()
    .notEmpty()
    .withMessage("Số đơn hàng là bắt buộc")
    .matches(/^ORD-\d{8}-\d{5}$/)
    .withMessage(
      "Định dạng số đơn hàng không hợp lệ. Dự kiến: ORD-YYYYMMDD-XXXXX",
    ),
];
