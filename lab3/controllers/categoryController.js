const categoryService = require('../services/categoriesServices');

exports.getCategories = async (req, res) => {
    const categories = await categoryService.getCategoriesWithAsyncAwait();
    res.render('categories', {title: 'Categories', categories: categories});
};

exports.getCategoryById = async (req, res) => {
    const response = await categoryService.getCategoryById(req.params.id);
    res.render('category', {title: 'Category', data: response });
}
