const { body, validationResult } = require('express-validator');

const createUserValidator = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Email is invalid.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const loginValidator = [
  body('email').isEmail().withMessage('Email is invalid.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const updateUserValidator = [
  body('name').optional().isString().withMessage('Name must be a string.'),
  body('email').optional().isEmail().withMessage('Email is invalid.').normalizeEmail(),
  body('address').optional().isString().withMessage('Address must be a string.'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Invalid phone number.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const updatePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { createUserValidator, loginValidator, updateUserValidator, updatePasswordValidator };
