const mongoose = require('mongoose');
const Course = require('../models/Course');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ALLOWED_SORT_FIELDS = ['createdAt', 'price', 'title', 'duration'];
const UPDATABLE_FIELDS = [
  'title',
  'description',
  'category',
  'instructor',
  'price',
  'duration',
  'level',
  'isPublished',
];

// @desc    Get all courses (search, filter, sort, pagination)
// @route   GET /api/courses?search=react&category=ID&level=beginner&minPrice=0&maxPrice=100&sort=-price&page=1&limit=10
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.search) {
    const regex = { $regex: escapeRegex(String(req.query.search)), $options: 'i' };
    filter.$or = [{ title: regex }, { description: regex }, { instructor: regex }];
  }

  if (req.query.category) {
    if (!mongoose.isValidObjectId(req.query.category)) {
      throw new ApiError(400, 'Invalid category ID in filter');
    }
    filter.category = req.query.category;
  }

  if (req.query.level) filter.level = req.query.level;

  if (req.query.isPublished !== undefined) {
    filter.isPublished = String(req.query.isPublished) === 'true';
  }

  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);
  if (req.query.minPrice !== undefined && !Number.isNaN(minPrice)) {
    filter.price = { ...filter.price, $gte: minPrice };
  }
  if (req.query.maxPrice !== undefined && !Number.isNaN(maxPrice)) {
    filter.price = { ...filter.price, $lte: maxPrice };
  }

  // Sorting: ?sort=price (ascending) or ?sort=-price (descending)
  let sort = { createdAt: -1 };
  if (req.query.sort) {
    const sortValue = String(req.query.sort);
    const field = sortValue.replace(/^-/, '');
    if (ALLOWED_SORT_FIELDS.includes(field)) {
      sort = { [field]: sortValue.startsWith('-') ? -1 : 1 };
    }
  }

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('createdBy', 'name email'),
    Course.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: courses.length,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: { courses },
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('createdBy', 'name email');

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  res.status(200).json({ success: true, data: { course } });
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, instructor, price, duration, level, isPublished } =
    req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, 'Category not found');
  }

  const course = await Course.create({
    title,
    description,
    category,
    instructor,
    price,
    duration,
    level,
    isPublished,
    createdBy: req.user._id,
  });

  await course.populate('category', 'name slug');

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: { course },
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      throw new ApiError(404, 'Category not found');
    }
  }

  UPDATABLE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) course[field] = req.body[field];
  });

  await course.save();
  await course.populate('category', 'name slug');

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: { course },
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (admin only)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
    data: {},
  });
});

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse };