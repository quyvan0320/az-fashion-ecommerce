import { body } from "express-validator";

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
