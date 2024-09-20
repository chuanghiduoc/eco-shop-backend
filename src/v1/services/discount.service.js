const Discount = require('../models/discount.model');

const checkDiscountPercentExists = async (percent) => {
  const existingDiscount = await Discount.findOne({ percent });
  return !!existingDiscount; 
};

const createDiscount = async (discountData) => {
  const existingDiscount = await checkDiscountPercentExists(discountData.percent);
  
  if (existingDiscount) {
    throw new Error(`Discount with ${discountData.percent}% already exists.`);
  }

  const newDiscount = new Discount(discountData);
  const savedDiscount = await newDiscount.save();

  const productIds = discountData.productList;
  await Product.updateMany(
    { _id: { $in: productIds } }, 
    { discount: savedDiscount._id } 
  );

  return savedDiscount;
};

const getAllDiscounts = async () => {
  return await Discount.find();
};

const getDiscountById = async (discountId) => {
  return await Discount.findById(discountId);
};

const updateDiscount = async (discountId, discountData) => {
  return await Discount.findByIdAndUpdate(discountId, discountData, { new: true });
};

const deleteDiscount = async (discountId) => {
  return await Discount.findByIdAndDelete(discountId);
};

const checkUpdateDiscount = async () => {
  const currentDate = new Date();
  
  const discounts = await Discount.find();

  const updatePromises = discounts.map(async (item) => {
    if (item.startDay <= currentDate && item.endDay >= currentDate && !item.status) {
      return await Discount.findByIdAndUpdate(
        item._id,
        { status: true },
        { new: true }
      );
    } else if (!(item.startDay <= currentDate && item.endDay >= currentDate) && item.status) {
      return await Discount.findByIdAndUpdate(
        item._id,
        { status: false },
        { new: true }
      );
    }
  });

  // Thực hiện tất cả các promises đồng thời
  await Promise.all(updatePromises);
};

setInterval(checkUpdateDiscount, 60000);

module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  checkUpdateDiscount,
  checkDiscountPercentExists
};
