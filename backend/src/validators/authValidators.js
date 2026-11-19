const { check, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  check('fullName', 'Full name is required and must be between 2 and 100 characters')
    .trim()
    .isLength({ min: 2, max: 100 }),
  check('email', 'Please provide a valid email address').isEmail().normalizeEmail(),
  check('phone', 'Phone number is required and must be at least 10 digits')
    .trim()
    .isLength({ min: 10 }),
  check('password', 'Password must be at least 6 characters long and contain letters and numbers')
    .isLength({ min: 6 }),
  validate
];

const loginValidation = [
  check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation
};
