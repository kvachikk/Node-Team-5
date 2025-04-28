const services = require('../services/categoriesServices');

const showMoveForm = async (req, res) => {
    try {
        const globalCategories = await services.getGlobalCategories();
        const dualList = await getJoinedListCategories();
        res.render('moveCategoriesForm', { title: 'Переміщення категорій', globalCategories, categories: dualList });
    } catch (error) {
        res.status(500).render('error', { message: `Помилка: ${error.message}` });
    }
};

const showCreateForm = async (req, res) => {
    res.render('createNewCategory', { title: 'Нова категорія', globalCategoryId: req.params.globalCategoryId });
};

const showUpdateForm = async (req, res) => {
    try {
        const category = await services.getById(req.params.id);
        res.render('updateCategoryForm', { category });
    } catch (error) {
        res.status(500).render('error', { message: `Помилка при отриманні категорії: ${error.message}` });
    }
};

const getAll = async (req, res) => {
    const data = await services.getAll();
    res.render('categoriesList', { title: 'Категорії', data });
};

const getAllCategoriesByGlobalCategory = async (req, res) => {
    const data = await services.getCategoriesByGlobalCategory(req.params.id);
    res.render('categoriesList', { title: 'Категорії', data, globalCategoryId: req.params.id });
};

const create = async (req, res) => {
    try {
        const categoryData = {
            name: req.body.name,
            description: req.body.description,
            image_url: req.body.image_url,
            global_category_id: req.body.global_category_id,
        };
        const newCategory = await services.create(categoryData);
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

const moveCategoriesToNewGlobal = async (req, res) => {
    try {
        const { categoryId, newGlobalId } = req.body;
        const updatedCategory = await services.moveCategoriesToNewGlobal(categoryId, newGlobalId);
        res.status(200).json({ success: true, data: updatedCategory });
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
    showMoveForm,
    moveCategoriesToNewGlobal,
    getAllCategoriesByGlobalCategory,
};