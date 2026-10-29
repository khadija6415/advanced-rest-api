const { body } = require('express-validator');

const createCourseRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Course title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Course description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Category must be a valid ID'),
  body('instructor')
    .trim()
    .notEmpty().withMessage('Instructor name is required')
    .isLength({ max: 60 }).withMessage('Instructor name cannot exceed 60 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a number and cannot be negative'),
  body('duration')
    .optional()
    .isFloat({ min: 1 }).withMessage('Duration must be a number of at least 1 hour'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate or advanced'),
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be true or false'),
];

const updateCourseRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Course title cannot be empty')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Course description cannot be empty')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isMongoId().withMessage('Category must be a valid ID'),
  body('instructor')
    .optional()
    .trim()
    .notEmpty().withMessage('Instructor name cannot be empty')
    .isLength({ max: 60 }).withMessage('Instructor name cannot exceed 60 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a number and cannot be negative'),
  body('duration')
    .optional()
    .isFloat({ min: 1 }).withMessage('Duration must be a number of at least 1 hour'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate or advanced'),
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be true or false'),
];

module.exports = { createCourseRules, updateCourseRules };