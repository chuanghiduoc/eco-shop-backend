const { body, param, validationResult } = require('express-validator');

const createDiscountValidator = [
  body('percent')
    .isNumeric().withMessage('Percent must be a number.')
    .isFloat({ min: 0, max: 100 }).withMessage('Percent must be between 0 and 100.'),
  
  body('startDay')
    .isISO8601().withMessage('Start day must be a valid date.'),
  
  body('endDay')
    .isISO8601().withMessage('End day must be a valid date.')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDay)) {
        throw new Error('End day must be after start day.');
      }
      return true;
    }),

  body('productList')
    .optional()
    .isArray().withMessage('Product list must be an array.')
    .custom((value) => {
      value.forEach(productId => {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          throw new Error('Each product ID must be a valid ObjectId.');
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

const updateDiscountValidator = [
  param('discountId')
    .isMongoId().withMessage('Discount ID must be a valid ObjectId.'),
  
  body('percent')
    .optional()
    .isNumeric().withMessage('Percent must be a number.')
    .isFloat({ min: 0, max: 100 }).withMessage('Percent must be between 0 and 100.'),
  
  body('startDay')
    .optional()
    .isISO8601().withMessage('Start day must be a valid date.'),
  
  body('endDay')
    .optional()
    .isISO8601().withMessage('End day must be a valid date.')
    .custom((value, { req }) => {
      if (req.body.startDay && new Date(value) < new Date(req.body.startDay)) {
        throw new Error('End day must be after start day.');
      }
      return true;
    }),

  body('productList')
    .optional()
    .isArray().withMessage('Product list must be an array.')
    .custom((value) => {
      value.forEach(productId => {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          throw new Error('Each product ID must be a valid ObjectId.');
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

module.exports = {
  createDiscountValidator,
  updateDiscountValidator,
};
