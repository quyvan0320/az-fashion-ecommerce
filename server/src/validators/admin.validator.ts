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
