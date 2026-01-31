import { body, param } from "express-validator";

export const addItemValidator = [
  body("productId")
    .notEmpty()
    .withMessage("ID sản phẩm không được để trống")
    .isUUID()
    .withMessage("ID sản phẩm không hợp lệ"),

  body("quantity")
    .optional()
    .isInt()
    .withMessage("Số lượng phải nằm trong khoản từ 1 đến 100"),
];

export const updateQuantityValidator = [
  param("id")
    .notEmpty()
    .withMessage("ID giỏ hàng không được để trống")
    .isUUID()
    .withMessage("ID sản phẩm không hợp lệ"),

  body("quantity")
    .optional()
    .isInt()
    .withMessage("Số lượng phải nằm trong khoản từ 1 đến 100"),
];

export const cartItemIdValidator = [
  param("id")
    .isUUID()
    .withMessage("ID mặt hàng không hợp lệ"),
];
