const express = require('express');
const controller = require('../controllers/categoryController');

const router = express.Router();

router.get('/showMoveForm', controller.showMoveForm);
router.post('/moveCategories', controller.moveCategoriesToNewGlobal);
router.get('/showCreateCategoryForm/:globalCategoryId', controller.showCreateForm);
router.get('/showUpdateForm/:id', controller.showUpdateForm);

router.get('/', controller.getAll);
router.post('/create', controller.create);
router.put('/update', controller.update);
router.delete('/remove', controller.remove);

router.get('/:id', controller.getAllCategoriesByGlobalCategory);

module.exports = router;