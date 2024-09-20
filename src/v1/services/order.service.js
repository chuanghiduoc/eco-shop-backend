const Order = require('../models/order.model');
const Product = require('../models/product.model');

const createOrder = async (userId, products, shippingAddress, paymentMethod) => {
  let totalAmount = 0;

  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (product) {
      const price = product.finalPrice;
      totalAmount += price * item.quantity;
    }
  }

  const newOrder = new Order({
    userId,
    products,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  await newOrder.save();
  return newOrder;
};
const getAllOrders = async (userId) => {
  return await Order.find({ userId }).populate('products.productId');
};

const updateOrderStatus = async (orderId, status) => {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
};
