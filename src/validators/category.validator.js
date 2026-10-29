const { body } = require('express-validator');

const createCategoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Description cannot exceed 300 characters'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be true or false'),
];

const updateCategoryRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Category name cannot be empty')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Description cannot exceed 300 characters'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be true or false'),
];

module.exports = { createCategoryRules, updateCategoryRules };