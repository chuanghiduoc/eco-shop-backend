const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  percent: { type: Number, required: true },
  startDay: { type: Date, required: true },
  endDay: { type: Date, required: true },
  productList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  status: { type: Boolean, default: false },
});

discountSchema.methods.isValid = function() {
  const now = new Date();
  return this.startDay <= now && this.endDay >= now && this.status;
};

module.exports = mongoose.model("Discount", discountSchema);
