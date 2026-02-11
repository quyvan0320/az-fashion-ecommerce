import { body, param, query } from "express-validator";

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


export const getProductReviewsValidator = [
    query('page')
    .optional()
    .isInt({min: 1})
    .withMessage('Trang phải là 1 số nguyên'),

    query('limit')
    .optional()
    .isInt({min: 1, max: 100})
    .withMessage('Trang phải là 1 số nguyên')
]