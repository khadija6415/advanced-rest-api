const express = require('express');

const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const courseRoutes = require('./course.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);

module.exports = router;