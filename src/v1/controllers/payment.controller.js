const paymentService = require('../services/payment.service');

const verifyPayment = async (req, res) => {
  const { orderId, amount } = req.body;

  if (!orderId || !amount) {
    return res.status(400).json({ 
      message: 'failed',
      details: 'Missing required fields: orderId or amount' });
  }

  try {
    const result = await paymentService.checkPaymentStatus(orderId, amount);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing payment', details: error.message });
  }
};

module.exports = {
  verifyPayment,
};