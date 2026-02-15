import { query } from "express-validator";

export const anylyticsValidator = [
    query('days')
    .optional()
    .isInt({min: 1, max: 365})
    .withMessage('Ngày chỉ được nằm khoản 1 đến 365'),

]