const Category = require('../models/Category');
const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get all categories (search, filter, pagination)
// @route   GET /api/categories?search=web&isActive=true&page=1&limit=10
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    filter.name = { $regex: escapeRegex(String(req.query.search)), $options: 'i' };
  }
  if (req.query.isActive !== undefined) {
    filter.isActive = String(req.query.isActive) === 'true';
  }

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email'),
    Category.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: categories.length,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: { categories },
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate('createdBy', 'name email');
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json({ success: true, data: { category } });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;

  const category = await Category.create({
    name,
    description,
    isActive,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category },
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Only allow these fields to be updated
  ['name', 'description', 'isActive'].forEach((field) => {
    if (req.body[field] !== undefined) category[field] = req.body[field];
  });

  await category.save(); // save() runs validators and regenerates the slug

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: { category },
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (admin only)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Do not delete a category which still has courses
  const coursesCount = await Course.countDocuments({ category: category._id });
  if (coursesCount > 0) {
    throw new ApiError(
      409,
      `Cannot delete category. ${coursesCount} course(s) are still using it`
    );
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
    data: {},
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};