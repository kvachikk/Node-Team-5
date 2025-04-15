const express = require('express');
const controller = require('../controllers/categoryController');

const router = express.Router();

router.get('/', controller.getAllCategories);
router.get('/:id', controller.getAllCategoriesByGlobalCategory);
router.get('/showCreateCategoryForm/:globalCategoryId', controller.showCreateCategoryForm);
router.post('/create', controller.processCreateCategory);

module.exports = router;