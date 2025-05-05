const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

router.get('/', (req, res) => {
  res.json({
    name: 'Electronics E-commerce API',
    version: '1.0.0',
    description: 'RESTful API for electronics e-commerce platform'
  });
});

module.exports = router; 