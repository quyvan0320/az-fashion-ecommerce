import { body, param, query } from 'express-validator';

export const createCategoryValidator = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Tên danh mục không được để trống')
    .isLength({min: 2, max: 100})
    .withMessage('Tên danh mục phải có độ dài từ 2 đến 100 ký tự'),

    body('description')
    .optional()
    .trim()
    .isLength({max: 500})
    .withMessage('Mô tả danh mục không được vượt quá 500 ký tự'),

    body('image')
    .optional()
    .isURL()
    .withMessage('Hình ảnh phải là một URL hợp lệ'),
]