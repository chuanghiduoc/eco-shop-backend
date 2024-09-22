const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const createProductValidator = [
  body('name')
    .notEmpty().withMessage('Name is required.')
    .isString().withMessage('Name must be a string.'),
  
  body('description')
    .notEmpty().withMessage('Description is required.')
    .isString().withMessage('Description must be a string.'),
  
  body('originalPrice')
    .isFloat({ min: 0 }).withMessage('Original price must be a positive number.'),
  
  body('discount')
    .optional()
    .custom(value => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Discount must be a valid ObjectId referencing the Discount schema.');
      }
      return true;
    }),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array of strings.')
    .custom((value) => {
      value.forEach(image => {
        if (typeof image !== 'string') {
          throw new Error('Each image must be a string.');
        }
      });
      return true;
    }),
  
  body('category')
    .notEmpty().withMessage('Category is required.')
    .isString().withMessage('Category must be a string.'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer.'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array of strings.')
    .custom((value) => {
      value.forEach(tag => {
        if (typeof tag !== 'string') {
          throw new Error('Each tag must be a string.');
        }
      });
      return true;
    }),
  
  body('colors')
    .optional()
    .isArray().withMessage('Colors must be an array of strings.')
    .custom((value) => {
      value.forEach(color => {
        if (typeof color !== 'string') {
          throw new Error('Each color must be a string.');
        }
      });
      return true;
    }),
  
  body('sizes')
    .optional()
    .isArray().withMessage('Sizes must be an array of strings.')
    .custom((value) => {
      value.forEach(size => {
        if (typeof size !== 'string') {
          throw new Error('Each size must be a string.');
        }
      });
      return true;
    }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = createProductValidator;
