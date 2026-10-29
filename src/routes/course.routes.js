const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course.controller');
const { createCourseRules, updateCourseRules } = require('../validators/course.validator');
const validate = require('../middlewares/validate.middleware');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(getCourses)
  .post(protect, createCourseRules, validate, createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, updateCourseRules, validate, updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

module.exports = router;