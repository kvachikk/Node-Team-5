const express = require('express');
const controller = require('../controllers/globalCategoryController');

const router = express.Router();

router.get('/', controller.getAll);
router.post('/create', controller.create);
router.put('/update', controller.update);
router.delete('/remove', controller.remove);
router.get('/showForm', controller.showCreateForm);
router.get('/showUpdateForm/:id', controller.showUpdateForm);

module.exports = router;