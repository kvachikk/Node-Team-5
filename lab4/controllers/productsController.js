const services = require('../services/productServices');

const getAllProducts = async (req, res) => {
    const data = await services.getAllProducts();
    res.render('categoriesList', {title: 'Categories', data: data});
};

const getAllProductsByCategoryId = async (req, res) => {
    const data = await services.getAllProductsByCategoryId(req.params.id);
    res.render('productList', {title: 'Товари', data: data});
};

const getProductById = async (req, res) => {
    const data = await services.getProductById(req.params.id);
    res.render('productDetails', {title: data.title, data: data});
};

module.exports = {
    getAllProducts,
    getProductById,
    getAllProductsByCategoryId,
};