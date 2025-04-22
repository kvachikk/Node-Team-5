const services = require('../services/categoriesServices');
const {getJoinedListCategories} = require("../services/categoriesServices");

const getAll = async (req, res) => {
    const data = await services.getAll();
    res.render('categoriesList', {title: 'Категорії', data: data});
};

const getAllCategoriesByGlobalCategory = async (req, res) => {
    const data = await services.getCategoriesByGlobalCategory(req.params.id);
    res.render('categoriesList', {title: 'Категорії', data: data, globalCategoryId: req.params.id});
};

const showCreateForm = async(req, res) => {
    res.render('createNewCategory', { title: 'Нова категорія',  globalCategoryId: req.params.globalCategoryId });
};

const showUpdateForm = async (req, res) => {
    const category = await services.getById(req.params.id);
    res.render('updateCategoryForm', {category: category});
};

const showMoveForm = async (req, res) => {
    try {
        const globalCategories = await services.getGlobalCategories();
        const dualList = await getJoinedListCategories();

        res.render('moveCategoriesForm', {title: 'Переміщення категорій', globalCategories: globalCategories, categories: dualList});
    } catch (error) {
        res.status(500).render('error', { message: `Помилка: ${error.message}` });
    }
};

const create = async(req, res) => {
    try {
        const categoryData = { name: req.body.name, description: req.body.description, image_url: req.body.image_url, global_category_id: req.body.global_category_id, };
        const newCategory = await services.create(categoryData);

        if(newCategory) res.redirect('/categories/'+ req.body.global_category_id);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        await services.update(req.body);
        res.status(200).json({ success: true});
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

const remove = async (req, res) => {
    try {
        await services.remove(req.body.id);
        res.status(200).json({ success: true});
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

const moveCategoriesToNewGlobal = async (req, res) => {
    const { categoryId, newGlobalId } = req.body;
    // Демонстрація транзакції з повним успіхом або відкатом
    const updatedCategory = await services.moveCategoriesToNewGlobal(categoryId, newGlobalId);
    if(updatedCategory) res.redirect('/');
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