import { body, param } from "express-validator";

export const createReviewValidator = [
  param("productId").isUUID().withMessage("ID sản phẩm không hợp lệ"),

  body("rating")
    .notEmpty()
    .withMessage("Đánh giá là bắt buộc")
    .isInt({ min: 1, max: 5 })
    .withMessage("Đánh giá phải nằm trong khoản 1 đến 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage("Bình luận phải nằm trong khoản 10 đến 100 ký tự"),
];
