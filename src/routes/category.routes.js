const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const {
  createCategoryRules,
  updateCategoryRules,
} = require('../validators/category.validator');
const validate = require('../middlewares/validate.middleware');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, createCategoryRules, validate, createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, updateCategoryRules, validate, updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;