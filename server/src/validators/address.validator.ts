import { body, param } from "express-validator";

export const addressInputValidator = [
  body("street")
    .trim()
    .notEmpty()
    .withMessage("Đường không được để trống")
    .isLength({ min: 5, max: 100 })
    .withMessage("Đường phải dài từ 5 đến 100 ký tự"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("Thành phố không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Thành phố phải dài từ 2 đến 100 ký tự"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("Bang/Tỉnh không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Bang/Tỉnh phải dài từ 2 đến 100 ký tự"),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Mã bưu chính không được để trống")
    .isLength({ min: 3, max: 100 })
    .withMessage("Mã bưu chính phải dài từ 3 đến 100 ký tự"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Quốc gia không được để trống")
    .isLength({ min: 3, max: 100 })
    .withMessage("Quốc gia phải dài từ 3 đến 100 ký tự"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault phải là kiểu boolean"),
];

export const addressUpdateValidator = [
  param("id").isUUID().withMessage("ID địa chỉ không hợp lệ"),

  body("street")
    .trim()
    .notEmpty()
    .withMessage("Đường không được để trống")
    .isLength({ min: 5, max: 100 })
    .withMessage("Đường phải dài từ 5 đến 100 ký tự"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("Thành phố không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Thành phố phải dài từ 2 đến 100 ký tự"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("Bang/Tỉnh không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Bang/Tỉnh phải dài từ 2 đến 100 ký tự"),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Mã bưu chính không được để trống")
    .isLength({ min: 3, max: 100 })
    .withMessage("Mã bưu chính phải dài từ 3 đến 100 ký tự"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Quốc gia không được để trống")
    .isLength({ min: 3, max: 100 })
    .withMessage("Quốc gia phải dài từ 3 đến 100 ký tự"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault phải là kiểu boolean"),
];
