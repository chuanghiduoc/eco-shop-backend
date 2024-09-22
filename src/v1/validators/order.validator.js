const { body, validationResult } = require('express-validator');

const createOrderValidator = [
  body('products')
    .isArray().withMessage('Products must be an array.')
    .notEmpty().withMessage('Products are required.')
    .custom((value) => {
      value.forEach(product => {
        if (typeof product.productId !== 'string' || typeof product.quantity !== 'number') {
          throw new Error('Each product must have a valid productId and quantity.');
        }
      });
      return true;
    }),
  
  body('shippingAddress')
    .isString().withMessage('Shipping address is required.'),
  
  body('paymentMethod')
    .isString().withMessage('Payment method is required.'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const updateOrderStatusValidator = [
  body('orderId')
    .isString().withMessage('Order ID is required.'),
  
  body('status')
    .isString().withMessage('Status is required.'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
};
