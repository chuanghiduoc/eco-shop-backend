const express = require('express');
const userController = require('../controllers/user.controller');
const productController = require('../controllers/product.controller');
const orderController = require('../controllers/order.controller');
const discountController = require('../controllers/discount.controller');
const paymentController = require('../controllers/payment.controller');
const authenticateToken = require('../middlewares/auth.middleware');

//bank
const tpbankController = require('../controllers/mainTpbank/tpbank.controller');

//validation
const { createUserValidator, loginValidator, updateUserValidator, updatePasswordValidator } = require('../validators/user.validator');
const createProductValidator = require('../validators/product.validator');
const { createOrderValidator, updateOrderStatusValidator } = require('../validators/order.validator');
const { createDiscountValidator, updateDiscountValidator } = require('../validators/discount.validator');

const router = express.Router();

router.get('/checkstatus', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'api ok'
    })
})
//user routes
router.post('/users/register', createUserValidator, userController.createUser);
router.post('/users/login', loginValidator, userController.loginUser);
router.post('/users/logout', authenticateToken, userController.logoutUser);
router.post('/users/refresh', userController.refreshToken);
router.get('/users/me', authenticateToken, userController.getUserInfo);
router.put('/users/me/update', authenticateToken, updateUserValidator, userController.updateUserInfo);
router.put('/users/update-password', authenticateToken, updatePasswordValidator, userController.updatePassword);
router.put('/users/update-address', authenticateToken, userController.updateAddress);
router.delete('/users/delete-address', authenticateToken, userController.deleteAddress);

router.post('/users/cart', authenticateToken, userController.addCart);
router.delete('/users/cart', authenticateToken, userController.removeItemCart);

router.post('/users/wishlist', authenticateToken, userController.addWishlist);
router.delete('/users/wishlist', authenticateToken, userController.removeWishlist);

//product routes
router.post('/products/addProduct', authenticateToken, createProductValidator, productController.createProduct);
router.get('/products/:productId', productController.getProductById);
router.get('/products', productController.getAllProducts);
router.delete('/products/:productId', authenticateToken, productController.deleteProduct);
router.get('/products/discount/:discountId', authenticateToken, productController.getProductsWithDiscounts);

//discount routes
router.post('/discounts/addDiscount', authenticateToken, createDiscountValidator, discountController.createDiscount);
router.get('/discounts', authenticateToken, discountController.getAllDiscounts);
router.delete('/discounts/deleteDiscount/:discountId', authenticateToken, discountController.deleteDiscount);
router.put('/discounts/updateDiscount/:discountId', authenticateToken, updateDiscountValidator, discountController.updateDiscount);
router.get('/discounts/:discountId', authenticateToken, discountController.getDiscountById);

//oder routes
router.post('/orders/createOder', authenticateToken, createOrderValidator, orderController.createOrder);
router.get('/orders', authenticateToken, orderController.getAllOrders);
router.put('/orders/updateOrderStatus', authenticateToken, updateOrderStatusValidator, orderController.updateOrderStatus);


//bank history
router.post('/tpbank/histories', tpbankController.getHistoriesTpbank);

//payment
router.post('/payment/verify', authenticateToken, paymentController.verifyPayment);

module.exports = router;