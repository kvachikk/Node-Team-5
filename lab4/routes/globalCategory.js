const express = require('express');
const controller = require('../controllers/globalCategoryController');

const router = express.Router();

router.get('/', controller.getGlobalCategories);
router.get('/createGlobalCategoryForm', controller.showCreateGlobalCategoryForm);
router.post('/create', controller.processCreateCategory);

module.exports = router;