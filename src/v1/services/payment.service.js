const orderService = require('./order.service');
const tpbankController = require('../controllers/mainTpbank/tpbank.controller');

const checkPaymentStatus = async (orderId) => {
  try {
    const order = await orderService.getOrderById(orderId);
    const expectedAmount = order.totalAmount; 
    if (!order) {
      throw new Error('Order not found');
    }

    const orderCreationTime = new Date(order.createdAt);
    const currentTime = new Date();
    const timeDifference = (currentTime - orderCreationTime) / (1000 * 60);
    
    if (timeDifference > 15) {
      return { success: false, message: 'Payment window has expired' };
    }

    const transactions = await tpbankController.getHistoriesTpbank();
    
    if (!transactions || transactions.length === 0) {
      throw new Error('No transaction history found');
    }

    console.log(expectedAmount);
    
    const transaction = transactions.find(trx => {
      const description = trx.description.toLowerCase().split('-')[0].trim();
      console.log(description);
      return description.startsWith('ecoshop') && 
             trx.description.toLowerCase().includes(orderId.toLowerCase()) && 
             parseFloat(trx.amount) === expectedAmount;
    });

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