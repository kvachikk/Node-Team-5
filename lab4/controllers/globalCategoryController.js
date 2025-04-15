const services = require('../services/globalCategoriesServices');

const getGlobalCategories = async (req, res) => {
    const data = await services.getAllGlobalCategories();
    res.render('welcome', {title: 'Welcome', data: data});
};

const showCreateGlobalCategoryForm = async (req, res) => {
    res.render('createGlobalCategoryForm', {title: 'Нова категорія'});
};
``
const processCreateCategory = async(req, res) => {
    try {
        const categoryData = {name: req.body.name, description: req.body.description, image_url: req.body.image_url};

        const newCategory = await services.createGlobalCategory(categoryData);
        if(newCategory) {
            res.redirect('/');
        }

    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).render('error', {
            title: 'Помилка',
            message: 'Не вдалося створити категорію'
        });
    }
};

module.exports = {
    getGlobalCategories,
    showCreateGlobalCategoryForm,
    processCreateCategory
};