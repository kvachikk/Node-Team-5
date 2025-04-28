const services = require('../services/productServices');
const categoryServices = require('../services/categoriesServices');


const showCreateForm = async (req, res) => {
    try {
        const categories = await categoryServices.getAll();
        res.render('createProductForm', { title: 'Новий товар', categories, categoryId: req.query.categoryId || null });
    } catch (error) {
        res.status(500).render('error', { message: `Помилка при завантаженні форми: ${error.message}` });
    }
};

const showUpdateForm = async (req, res) => {
    try {
        const product = await services.getById(req.params.id);
        const categories = await categoryServices.getAll();
        if (!product) return res.status(404).render('error', { message: 'Товар не знайдено' });
        res.render('updateProductForm', { title: 'Редагувати товар', product, categories });
    } catch (error) {
        res.status(500).render('error', { message: `Помилка при завантаженні форми: ${error.message}` });
    }
};


const getAll = async (req, res) => {
    const data = await services.getAll();
    res.render('productList', { title: 'Всі товари', data });
};

const getById = async (req, res) => {
    try {
        const product = await services.getById(req.params.id);
        if (!product) return res.status(404).render('error', { message: 'Товар не знайдено' });
        res.render('productDetails', { title: product.name, data: product });
    } catch (error) {
        res.status(500).render('error', { message: `Помилка при отриманні товару: ${error.message}` });
    }
};

const getAllByCategoryId = async (req, res) => {
    const data = await services.getAllByCategoryId(req.params.id);
    res.render('productList', { title: 'Товари категорії', data, categoryId: req.params.id });
};

const create = async (req, res) => {
    try {
        const newProduct = await services.create(req.body);
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const updatedProduct = await services.update(req.params.id, req.body);
        if (!updatedProduct) return res.status(404).json({ success: false, message: 'Товар не знайдено' });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const deletedProduct = await services.remove(req.params.id);
        if (!deletedProduct) return res.status(404).json({ success: false, message: 'Товар не знайдено' });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const search = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) return res.redirect('/products');
        const results = await services.search(searchTerm);
        res.render('productList', { title: `Результати пошуку: ${searchTerm}`, data: results, searchTerm });
    } catch (error) {
        res.status(500).render('error', { message: `Помилка при пошуку товарів: ${error.message}` });
    }
};

module.exports = {
    getAll,
    getById,
    getAllByCategoryId,
    showCreateForm,
    showUpdateForm,
    create,
    update,
    remove,
    search,
};