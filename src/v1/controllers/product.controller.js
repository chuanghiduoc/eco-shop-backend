const productService = require('../services/product.service');

const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Kiểm tra nếu có discount thì phải là ObjectId của bảng Discount, không phải là số phần trăm
    if (productData.discount && typeof productData.discount === 'number') {
      return res.status(400).json({
        message: 'failed',
        details: 'Discount must be a valid ObjectId referencing the Discount schema',
      });
    }

    const newProduct = await productService.createProduct(productData);

    res.status(201).json({
      message: 'success',
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      message: 'success',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: 'failed',
      details: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await productService.deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: 'failed',
        details: { message: 'Product not found' },
      });
    }

    res.status(200).json({
      message: 'success',
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const createNewReview = async (req, res) => {
  const { productId } = req.params;
  const reviewData = {
    userId: req.user.userId,
    rating: req.body.rating,
    comment: req.body.comment,
  };

  try {
    const updatedProduct = await productService.createNewReview(productId, reviewData);

    res.status(200).json({
      message: 'success',
      data: updatedProduct,
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({
        message: 'failed',
        details: error.message,
      });
    }
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  createNewReview
};
