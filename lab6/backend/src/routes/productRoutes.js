const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productValidator } = require('../middlewares/validators');

// Product search and filter routes
router.get('/search', productController.searchProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/category/:categoryId/paginated', productController.getProductsByCategoryPaginated);
router.get('/paginated', productController.getAllProductsPaginated);

// Product CRUD routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productValidator.createProduct, productController.createProduct);
router.put('/:id', productValidator.updateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Transaction demonstration route
router.post('/category/:categoryId/bulk', productValidator.bulkCreateProducts, productController.bulkCreateProducts);

module.exports = router; 