import { body, param, query } from "express-validator";

// Validator for creating a new category
export const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên danh mục không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên danh mục phải có độ dài từ 2 đến 100 ký tự"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Mô tả danh mục không được vượt quá 500 ký tự"),

  body("image")
    .optional()
    .isURL()
    .withMessage("Hình ảnh phải là một URL hợp lệ"),
];


// Validator for getting categories with pagination and search
export const getCategoriesValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Trang phải là một số nguyên dương"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Giới hạn phải là một số nguyên từ 1 đến 100"),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Từ khóa tìm kiếm không được vượt quá 100 ký tự"),
];


// Validator for category ID parameter
export const categoryIdParamValidator = [
  param("id")
  .isUUID()
  .withMessage("ID danh mục không hợp lệ"),
]