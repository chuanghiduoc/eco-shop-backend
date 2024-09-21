const orderService = require('../services/order.service');
const redisClient = require('../databases/init.redis'); 

const createOrder = async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body;
  const userId = req.user.userId;

  try {
    const newOrder = await orderService.createOrder(userId, products, shippingAddress, paymentMethod);

    await redisClient.del(`orders:${userId}`);

    res.status(201).json({
      message: 'success',
      data: newOrder,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  const userId = req.user.userId;
  const cacheKey = `orders:${userId}`;

  try {
    const cachedOrders = await redisClient.get(cacheKey);
    if (cachedOrders) {
      return res.status(200).json({
        message: 'success',
        data: JSON.parse(cachedOrders),
      });
    }

    const orders = await orderService.getAllOrders(userId);

    await redisClient.set(cacheKey, JSON.stringify(orders), 'EX', 3600);

    res.status(200).json({
      message: 'success',
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body; 

  try {
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.status(200).json({
      message: 'success',
      data: updatedOrder,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
};
