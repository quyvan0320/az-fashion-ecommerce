import { param, body, query } from "express-validator";

// create product
export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên không được để trống")
    .isLength({ min: 3, max: 100 })
    .withMessage("Tên phải dài từ 3 đến 100 ký tự"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Mô tả không vượt quá 2000 ký tự"),

  body("price")
    .notEmpty()
    .withMessage("Giá không được để trống")
    .isInt({ min: 0 })
    .withMessage("Giá phải là số nguyên dương"),

  body("salePrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Giá phải là số nguyên dương"),

  body("sku")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU không vượt quá 2000 ký tự")
    .matches(/^[A-Z0-9-]+$/)
    .withMessage("SKU chỉ chưa ký tự in hoa, số và gạch nối"),

  body("stock")
    .notEmpty()
    .withMessage("Hàng hóa không được để trống")
    .isInt({ min: 0 })
    .withMessage("Hàng hóa phải là số nguyên dương"),

  body("categoryId")
    .notEmpty()
    .withMessage("Danh mục không được để trống")
    .isUUID()
    .withMessage("ID danh mục không hợp lệ"),

  body("images")
    .notEmpty()
    .withMessage("Cần có ít nhất 1 hình ảnh")
    .isArray({ min: 1, max: 10 })
    .withMessage("Phải cung cấp 1 đến 10 hình ảnh"),

  body("images.*")
    .trim()
    .isURL()
    .withMessage("Mỗi hình ảnh phải là URL hợp lệ"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive phải là kiểu Boolean"),
];

// get products query
export const getProductsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Trang phải là số nguyên dương"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Giới hạn phải nằm trong khoảng từ 1 đến 100"),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Truy vấn tìm kiếm không được quá 100 ký tự"),

  query("categoryId")
    .optional()
    .isUUID()
    .withMessage("ID danh mục không hợp lệ"),

  query("minPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Giá tối thiểu phải là số nguyên dương"),

  query("maxPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Giá cao nhất phải là số nguyên dương"),

  query("inStock")
    .optional()
    .isBoolean()
    .withMessage("Truy vấn tồn kho phải là một Boolean"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("Truy vấn hiệu lực phải là một Boolean"),

  query("sortBy")
    .optional()
    .isIn(["price", "name", "createdAt", "stock"])
    .withMessage("Sắp xếp phải là 1 trong: price, name, createdAt, stock"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Thứ tự phải là asc hoặc desc"),
];

// get product param
export const productIdValidator = [
  param('id')
  .isUUID()
  .withMessage("ID sản phẩm không hợp lệ")
]