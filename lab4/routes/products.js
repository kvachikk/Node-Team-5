const express = require('express');
const controller = require('../controllers/productsController');

const router = express.Router();

router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);
router.get('/categories/:id', controller.getAllProductsByCategoryId);

module.exports = router;
