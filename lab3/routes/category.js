const express = require('express');
const controller = require('../controllers/categoryController');

const router = express.Router();
router.get('/', controller.getCategories);
router.get('/:id', controller.getCategoryById);


module.exports = router;