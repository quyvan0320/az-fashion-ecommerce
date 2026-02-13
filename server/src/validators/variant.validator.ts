import { body, param } from "express-validator";

export const createVariantValidator = [
  param("productId").isUUID().withMessage("ID sản phẩm không hợp lệ"),
  body("size")
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Kích thước phải từ 1 đến 20 ký tự"),
  body("color")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Màu sắc phải từ 1 đến 50 ký tự"),
  body("price")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Gía tiền phải là 1 số nguyên dương"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Gía tiền phải là 1 số nguyên dương"),
  body("sku")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU phải có từ 3 đến 50 ký tự")
    .matches(/^[A-Z0-9-]+$/)
    .withMessage("SKU chỉ được chứa chữ in hoa, số và dấu gạch nối"),
];

export const updateVariantValidator = [
  param("id").isUUID().withMessage("ID sản phẩm không hợp lệ"),
  body("size")
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Kích thước phải từ 1 đến 20 ký tự"),
  body("color")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Màu sắc phải từ 1 đến 50 ký tự"),
  body("price")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Gía tiền phải là 1 số nguyên dương"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Gía tiền phải là 1 số nguyên dương"),
  body("sku")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU phải có từ 3 đến 50 ký tự")
    .matches(/^[A-Z0-9-]+$/)
    .withMessage("SKU chỉ được chứa chữ in hoa, số và dấu gạch nối"),
];

export const productVariantsValidator = [
  param("productId").isUUID().withMessage("ID sản phẩm không hợp lệ"),
];


export const variantIdValidator = [
  param("id").isUUID().withMessage("ID biến thể không hợp lệ"),
];