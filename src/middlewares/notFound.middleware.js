const ApiError = require('../utils/ApiError');

// Runs when no route matches (unknown URL) -> 404
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;