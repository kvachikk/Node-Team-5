const express = require('express');
const controller = require('../controllers/productsController');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/search', controller.search);
router.get('/create', controller.showCreateForm);
router.get('/update/:id', controller.showUpdateForm);
router.post('/create', controller.create);
router.post('/update/:id', controller.update);
router.delete('/delete/:id', controller.remove);
router.get('/category/:id', controller.getAllByCategoryId);

module.exports = router;