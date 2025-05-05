const productService = require('../services/productService');

const productController = {
 
  getAllProducts: async (req, res, next) => {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({
        status: 'success',
        data: products
      });
    } catch (error) {
      next(error);
    }
  },
  
  getAllProductsPaginated: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 3;
      
      const result = await productService.getAllProductsPaginated(page, limit);
      
      res.status(200).json({
        status: 'success',
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },
  
  getProductById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.status(200).json({
        status: 'success',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },
  
  createProduct: async (req, res, next) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        status: 'success',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      res.status(200).json({
        status: 'success',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },
  
  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  getProductsByCategory: async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const products = await productService.getProductsByCategory(categoryId);
      res.status(200).json({
        status: 'success',
        data: products
      });
    } catch (error) {
      next(error);
    }
  },
  
  getProductsByCategoryPaginated: async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 3;
      
      const result = await productService.getProductsByCategoryPaginated(categoryId, page, limit);
      
      res.status(200).json({
        status: 'success',
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },

  searchProducts: async (req, res, next) => {
    try {
      const products = await productService.searchProducts(req.query);
      res.status(200).json({ status: 'success', data: products });
    } catch (error) {
      next(error);
    }
  },
  
  bulkCreateProducts: async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const { products } = req.body;
      
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Products array is required and cannot be empty'
        });
      }
      
      const createdProducts = await productService.bulkCreateProducts(products, categoryId);
      
      res.status(201).json({
        status: 'success',
        message: `Successfully created ${createdProducts.length} products`,
        data: createdProducts
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController; 