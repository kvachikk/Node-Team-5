const services = require('../services/globalCategoriesServices');


const showCreateForm = async (req, res) => {
    res.render('createGlobalCategoryForm', { title: 'Нова глобальна категорія' });
};

const showUpdateForm = async (req, res) => {
    try {
        const category = await services.getById(req.params.id);
        res.render('updateGlobalCategoryForm', { category });
    } catch (error) {
        res.status(500).render('error', { message: `Помилка при завантаженні категорії: ${error.message}` });
    }
};


const getAll = async (req, res) => {
    const data = await services.getAll();
    res.render('welcome', { title: 'Глобальні категорії', data });
};

const create = async (req, res) => {
    try {
        const newCategory = await services.create(req.body);
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const updatedCategory = await services.update({ ...req.body, id: req.params.id });
        res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await services.remove(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAll,
    create,
    update,
    remove,
    showCreateForm,
    showUpdateForm,
};