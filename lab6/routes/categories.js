const express = require('express');
const controller = require('../controllers/categoryController');

const router = express.Router();

router.get('/form/move', controller.showMoveForm);
router.get('/form/create/:globalCategoryId', controller.showCreateForm);
router.get('/form/update/:id', controller.showUpdateForm);

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/', controller.remove);

router.get('/global/:id', controller.getAllCategoriesByGlobalCategory);
router.post('/move', controller.moveCategoriesToNewGlobal);


module.exports = router;