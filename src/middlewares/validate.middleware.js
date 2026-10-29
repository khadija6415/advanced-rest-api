const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Collects express-validator errors and returns a 400 Bad Request
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array({ onlyFirstError: true }).map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  next(new ApiError(400, 'Validation failed', errors));
};

module.exports = validate;