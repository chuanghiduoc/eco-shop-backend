const Product = require("../models/product.model");

const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await Product.find()
    .populate("discount")
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    products,
    currentPage: page,
    totalPages,
    totalProducts,
  };
};

const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};

const createNewReview = async (productId, reviewData) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
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
const getProductsByDiscount = async (discountId) => {
  try {
    const products = await Product.find({ discountId: discountId });
    return products;
  } catch (error) {
    throw new Error(`Error retrieving products: ${error.message}`);
  }
};
const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    throw new Error(`Error retrieving products: ${error.message}`);
  }
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
  getProductsByDiscount,
  getProductById,
};
