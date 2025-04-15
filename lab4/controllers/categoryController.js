const services = require('../services/categoriesServices');

const getAllCategories = async (req, res) => {
    const data = await services.getAllCategories();
    res.render('categoriesList', {title: 'Категорії', data: data});
};

const getAllCategoriesByGlobalCategory = async (req, res) => {
    const data = await services.getCategoriesByGlobalCategory(req.params.id);
    res.render('categoriesList', {title: 'Категорії', data: data, globalCategoryId: req.params.id});
};

const showCreateCategoryForm = async(req, res) => {
    res.render('createNewCategory', { title: 'Нова категорія',  globalCategoryId: req.params.globalCategoryId });
};

const processCreateCategory = async(req, res) => {
    try {
        const categoryData = { name: req.body.name, description: req.body.description, image_url: req.body.image_url, global_category_id: req.body.global_category_id, };

        const newCategory = await services.createCategory(categoryData);

        if(newCategory) {
            res.redirect('/categories/'+ req.body.global_category_id);
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
    showCreateCategoryForm,
    processCreateCategory,
    getAllCategories,
    getAllCategoriesByGlobalCategory,
};