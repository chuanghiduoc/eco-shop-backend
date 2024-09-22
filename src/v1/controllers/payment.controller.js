const paymentService = require('../services/payment.service');
const axios = require('axios');
const orderService = require('../services/order.service');

const verifyPayment = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ 
      message: 'failed',
      details: 'Missing required fields: orderId' 
    });
  }

  const order = await orderService.getOrderById(orderId);
  const amount = order.totalAmount; 

  try {
    const result = await paymentService.checkPaymentStatus(orderId);

    if (result.success) {
      // Gửi thông tin thanh toán thành công đến Discord
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      const message = `Order ${orderId} has been paid successfully for amount ${amount}.`;

      await axios.post(webhookUrl, {
        content: message,
      });

      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error processing payment:', error.message);
    return res.status(500).json({ message: 'Error processing payment', details: error.message });
  }
};


module.exports = {
  verifyPayment,
};