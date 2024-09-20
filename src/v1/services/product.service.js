const Product = require('../models/product.model');

const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};


const getAllProducts = async () => {
  return await Product.find().populate('discount');
};

const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};

const createNewReview = async (productId, reviewData) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  product.ratings.push(reviewData);
  await product.save();
  return product;
};
const removeDiscountFromProducts = async (discountId) => {
  return await Product.updateMany(
    { discount: discountId },
    { $unset: { discount: "" } }
  );
};
const updateProductsWithDiscount = async (productIds, discountId) => {
  const updatedProducts = await Product.updateMany(
    { _id: { $in: productIds } },
    { discount: discountId },
    { new: true }
  );

  return updatedProducts;
};

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  createNewReview,
  removeDiscountFromProducts,
  updateProductsWithDiscount,
};
