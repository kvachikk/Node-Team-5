const express = require('express');
const controller = require('../controllers/categoryController');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getAllCategoriesByGlobalCategory);
router.post('/create', controller.create);
router.put('/update', controller.update);
router.delete('/remove', controller.remove);
router.get('/showCreateCategoryForm/:globalCategoryId', controller.showCreateForm);
router.get('/showUpdateForm/:id', controller.showUpdateForm);

module.exports = router;