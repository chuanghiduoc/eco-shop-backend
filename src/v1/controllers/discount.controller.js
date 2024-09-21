const discountService = require('../services/discount.service');
const productService = require('../services/product.service');
const redisClient = require('../databases/init.redis'); 

const createDiscount = async (req, res) => {
  try {
    const discountData = req.body;

    const newDiscount = await discountService.createDiscount(discountData);

    if (discountData.productList && discountData.productList.length > 0) {
      await productService.updateProductsWithDiscount(discountData.productList, newDiscount._id);
    }

    await redisClient.del('discounts:all');
    
    res.status(201).json({
      message: 'success',
      data: newDiscount,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const getAllDiscounts = async (req, res) => {
  const cacheKey = 'discounts:all';

  try {
    const cachedDiscounts = await redisClient.get(cacheKey);
    if (cachedDiscounts) {
      return res.status(200).json({
        message: 'success',
        data: JSON.parse(cachedDiscounts),
      });
    }

    const discounts = await discountService.getAllDiscounts();

    await redisClient.set(cacheKey, JSON.stringify(discounts), 'EX', 3600);

    res.status(200).json({
      message: 'success',
      data: discounts,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const getDiscountById = async (req, res) => {
  const { discountId } = req.params;
  try {
    const discount = await discountService.getDiscountById(discountId);
    if (!discount) {
      return res.status(404).json({
        message: 'failed',
        details: 'Discount not found',
      });
    }
    res.status(200).json({
      message: 'success',
      data: discount,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

const updateDiscount = async (req, res) => {
  const { discountId } = req.params;
  const discountData = req.body;

  try {
    const updatedDiscount = await discountService.updateDiscount(discountId, discountData);
    if (!updatedDiscount) {
      return res.status(404).json({
        message: 'failed',
        details: 'Discount not found',
      });
    }

    if (discountData.productList) {
      await productService.updateProductsWithDiscount(discountData.productList, updatedDiscount._id);
    }

    res.status(200).json({
      message: 'success',
      data: updatedDiscount,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};


const deleteDiscount = async (req, res) => {
  const { discountId } = req.params;
  try {
    const deletedDiscount = await discountService.deleteDiscount(discountId);
    if (!deletedDiscount) {
      return res.status(404).json({
        message: 'failed',
        details: 'Discount not found',
      });
    }

    // Xóa discount khỏi các sản phẩm liên quan
    await productService.removeDiscountFromProducts(discountId);

    res.status(200).json({
      message: 'success',
      data: deletedDiscount,
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};


const checkAndUpdateDiscounts = async (req, res) => {
  try {
    await discountService.checkUpdateDiscount();
    res.status(200).json({
      message: 'success',
      details: 'Discount statuses updated',
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      details: error.message,
    });
  }
};

module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  checkAndUpdateDiscounts,
};
