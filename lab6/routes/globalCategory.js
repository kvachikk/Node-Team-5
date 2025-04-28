const express = require('express');
const controller = require('../controllers/globalCategoryController');

const router = express.Router();

router.get('/form/create', controller.showCreateForm);                  
router.get('/form/update/:id', controller.showUpdateForm);              

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/', controller.remove); 

module.exports = router;