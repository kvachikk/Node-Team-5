const services = require('../services/productServices');

const getAll = async (req, res) => {
    try {
        const data = await services.getAll();
        res.render('productList', {title: 'Всі товари', data: data});
    } catch (error) {
        res.status(500).render('error', {message: `Помилка при отриманні товарів: ${error.message}`});
    }
};

const getById = async (req, res) => {
    try {
        const data = await services.getById(req.params.id);
        if (!data) {
            return res.status(404).render('error', {message: 'Товар не знайдено'});
        }
        res.render('productDetails', {title: data.name, data: data});
    } catch (error) {
        res.status(500).render('error', {message: `Помилка при отриманні товару: ${error.message}`});
    }
};

const getAllByCategoryId = async (req, res) => {
    try {
        const data = await services.getAllByCategoryId(req.params.id);
        res.render('productList', {title: 'Товари категорії', data: data, categoryId: req.params.id});
    } catch (error) {
        res.status(500).render('error', {message: `Помилка при отриманні товарів категорії: ${error.message}`});
    }
};

const showCreateForm = async (req, res) => {
    try {
        // Отримуємо всі категорії для випадаючого списку
        const categories = await require('../services/categoriesServices').getAll();
        res.render('createProductForm', {
            title: 'Додати новий товар',
            categories: categories,
            categoryId: req.query.categoryId || null
        });
    } catch (error) {
        res.status(500).render('error', {message: `Помилка при завантаженні форми: ${error.message}`});
    }
};

const showUpdateForm = async (req, res) => {
    try {
        const product = await services.getById(req.params.id);
        if (!product) {
            return res.status(404).render('error', {message: 'Товар не знайдено'});
        }

        const categories = await require('../services/categoriesServices').getAll();
        res.render('updateProductForm', {
            title: 'Редагувати товар',
            product: product,
            categories: categories
        });
    } catch (error) {
        res.status(500).render('error', {message: `Помилка при завантаженні форми: ${error.message}`});
    }
};

const create = async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            description: req.body.description,
            image_url: req.body.image_url,
            price: parseFloat(req.body.price),
            stock_quantity: parseInt(req.body.stock_quantity, 10),
            category_id: parseInt(req.body.category_id, 10)
        };

        const newProduct = await services.create(productData);
        res.redirect(`/products/${newProduct.id}`);
    } catch (error) {
        res.status(500).render('error', {message: `Помилка при створенні товару: ${error.message}`});
    }
};

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const productData = {
            name: req.body.name,
            description: req.body.description,
            image_url: req.body.image_url,
            price: parseFloat(req.body.price),
            stock_quantity: parseInt(req.body.stock_quantity, 10),
            category_id: parseInt(req.body.category_id, 10)
        };

        const updatedProduct = await services.update(id, productData);
        if (!updatedProduct) {
            return res.status(404).render('error', {message: 'Товар не знайдено'});
        }

        res.redirect(`/products/${id}`);
    } catch (error) {
        res.status(500).render('error', {message: `Помилка при оновленні товару: ${error.message}`});
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await services.remove(id);

        if (!result) {
            return res.status(404).json({success: false, message: 'Товар не знайдено'});
        }

        res.status(200).json({success: true, message: 'Товар успішно видалено'});
    } catch (error) {
        res.status(500).json({success: false, message: `Помилка при видаленні товару: ${error.message}`});
    }
};

const search = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.redirect('/products');
        }

        const results = await services.search(searchTerm);
        res.render('productList', {
            title: `Результати пошуку: ${searchTerm}`,
            data: results,
            searchTerm: searchTerm
        });
    } catch (error) {
        res.status(500).render('error', {message: `Помилка при пошуку товарів: ${error.message}`});
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
    search
};