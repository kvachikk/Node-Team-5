const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { categoryValidator } = require('../middlewares/validators');

router.get('/paginated', categoryController.getAllCategoriesPaginated);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryValidator.createCategory, categoryController.createCategory);
router.put('/:id', categoryValidator.updateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
module.exports = router; 