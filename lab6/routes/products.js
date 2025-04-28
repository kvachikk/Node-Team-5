const express = require('express');
const controller = require('../controllers/productsController');

const router = express.Router();

router.get('/form/create', controller.showCreateForm);
router.get('/form/update/:id', controller.showUpdateForm);

router.get('/', controller.getAll);        
router.get('/search', controller.search); 
router.get('/categories/:id', controller.getAllByCategoryId);

router.get('/:id', controller.getById);  
router.post('/', controller.create); 
router.put('/:id', controller.update); 
router.delete('/:id', controller.remove);


module.exports = router;