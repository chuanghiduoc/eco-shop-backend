const chai = require('chai');
const sinon = require('sinon');
const productService = require('../services/product.service');
const productController = require('../controllers/product.controller');
const redisClient = require('../databases/init.redis'); 

const { expect } = chai;

describe('Product Controller', () => {
  describe('createProduct', () => {
    it('should create a new product and return 201', async () => {
      const req = {
        body: {
          name: 'Test Product',
          price: 100,
          discount: '609b1e92c1a5e1c8c4b45678', // Example ObjectId
        },
      };
      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: sinon.spy(),
      };
  
      const newProduct = { _id: 'newProductId', name: 'Test Product', price: 100 };
      sinon.stub(productService, 'createProduct').resolves(newProduct);
      sinon.stub(redisClient, 'del').resolves();
  
      await productController.createProduct(req, res);
  
      expect(res.statusCode).to.equal(201);
      expect(res.json.calledWith({
        message: 'success',
        data: newProduct,
      })).to.be.true;
  
      productService.createProduct.restore();
      redisClient.del.restore();
    });
  
    it('should return 400 if discount is a number', async () => {
      const req = {
        body: {
          name: 'Test Product',
          price: 100,
          discount: 20, // Invalid discount
        },
      };
      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: sinon.spy(),
      };
  
      await productController.createProduct(req, res);
  
      expect(res.statusCode).to.equal(400);
      expect(res.json.calledWith({
        message: 'failed',
        details: 'Discount must be a valid ObjectId referencing the Discount schema',
      })).to.be.true;
    });
  
    it('should return 400 on error', async () => {
      const req = {
        body: {
          name: 'Test Product',
          price: 100,
          discount: '609b1e92c1a5e1c8c4b45678',
        },
      };
      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: sinon.spy(),
      };
  
      sinon.stub(productService, 'createProduct').rejects(new Error('Database error'));
  
      await productController.createProduct(req, res);
  
      expect(res.statusCode).to.equal(400);
      expect(res.json.calledWith({
        message: 'failed',
        details: 'Database error',
      })).to.be.true;
  
      productService.createProduct.restore();
    });
  });
  

  describe('getAllProducts', () => {
    it('should return cached products and status 200', async () => {
      const req = {};
      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: sinon.spy(),
      };
  
      const cachedProducts = [{ id: 1, name: 'Product A' }];
      sinon.stub(redisClient, 'get').resolves(JSON.stringify(cachedProducts));
  
      await productController.getAllProducts(req, res);
  
      expect(res.statusCode).to.equal(200);
      expect(res.json.calledWith({
        message: 'success',
        data: cachedProducts,
      })).to.be.true;
  
      redisClient.get.restore();
    });
  
    it('should return all products from the service if not cached', async () => {
      const req = {};
      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: sinon.spy(),
      };
  
      const products = [{ id: 2, name: 'Product B' }];
      sinon.stub(redisClient, 'get').resolves(null);
      sinon.stub(productService, 'getAllProducts').resolves(products);
      sinon.stub(redisClient, 'set').resolves();
  
      await productController.getAllProducts(req, res);
  
      expect(res.statusCode).to.equal(200);
      expect(res.json.calledWith({
        message: 'success',
        data: products,
      })).to.be.true;
  
      expect(redisClient.set.calledWith('products', JSON.stringify(products), 'EX', 3600)).to.be.true;
  
      redisClient.get.restore();
      productService.getAllProducts.restore();
      redisClient.set.restore();
    });
  
    it('should return status 500 on error', async () => {
      const req = {};
      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: sinon.spy(),
      };
  
      sinon.stub(redisClient, 'get').rejects(new Error('Redis error'));
  
      await productController.getAllProducts(req, res);
  
      expect(res.statusCode).to.equal(500);
      expect(res.json.calledWith({
        message: 'failed',
        details: 'Redis error',
      })).to.be.true;
  
      redisClient.get.restore();
    });
  });
  
});
