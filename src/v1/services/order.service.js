const Order = require('../models/order.model');
const User = require('../models/user.model');

const createOrder = async (userId, shippingAddress, paymentMethod) => {
  const user = await User.findById(userId).populate('cart.productId');

  if (!user || !user.cart || user.cart.length === 0) {
    throw new Error('Giỏ hàng trống');
  }

  let totalAmount = 0;
  const orderProducts = [];

  // Tính toán tổng số tiền và chuẩn bị dữ liệu đơn hàng
  for (const item of user.cart) {
    const product = item.productId;

    if (!product) {
      throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
    }

    const price = product.originalPrice; // Giá của sản phẩm (bạn có thể điều chỉnh nếu có giảm giá)
    const quantity = item.quantity;
    totalAmount += price * quantity;

    // Thêm sản phẩm vào danh sách đơn hàng
    orderProducts.push({
      productId: product._id,
      quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    });
  }

  // Tạo đơn hàng
  const newOrder = new Order({
    userId,
    products: orderProducts,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  await newOrder.save();

  // Xóa giỏ hàng sau khi tạo đơn hàng thành công
  user.cart = [];
  await user.save();

  return newOrder;
};


const getAllOrders = async (userId) => {
  return await Order.find({ userId }).populate('products.productId');
};

const getOrderById = async (orderId) => {
  return await Order.findById(orderId);
};

const updateOrderStatus = async (orderId, status) => {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById
};
