const tpbankController = require('../controllers/mainTpbank/tpbank.controller');
const orderService = require('./order.service');

const checkPaymentStatus = async (orderId, expectedAmount) => {
  try {
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const orderCreationTime = new Date(order.createdAt);
    const currentTime = new Date();

    const timeDifference = (currentTime - orderCreationTime) / (1000 * 60);
    
    if (timeDifference > 15) {
      return { success: false, message: 'Payment window has expired' };
    }

    const transactions = await tpbankService.getHistoriesTpbank();
    const transaction = transactions.find(trx => 
      trx.description.includes(`ecoshop ${orderId}`) && 
      parseFloat(trx.amount) === expectedAmount
    );

    if (transaction) {
      await orderService.updateOrderStatus(orderId, 'Paid');
      return { success: true, message: 'Payment verified and order updated' };
    } else {
      return { success: false, message: 'Payment not found or incorrect amount' };
    }
  } catch (error) {
    throw new Error('Error verifying payment: ' + error.message);
  }
};

module.exports = {
  checkPaymentStatus,
};