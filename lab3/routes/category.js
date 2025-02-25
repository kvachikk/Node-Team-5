const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();
router.get('/all', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/create', categoryController.create);
router.put('/edit', categoryController.edit);
router.delete('/delete', categoryController.delete);

module.exports = router;