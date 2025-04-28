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

    let page = req.query.page || 1;
    let max_page = Math.ceil(data.length / 6);
    const shownData = data.splice(6 * (page - 1), 6 * page);

    res.render('welcome',
        {
            title: 'Глобальні категорії',
            max_page: max_page,
            page: page,
            data: shownData,
        });
};

const create = async (req, res) => {
    try {
        const newCategory = await services.create(req.body);
        console.log(newCategory);
        if (newCategory) res.redirect('/');
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const updatedCategory = await services.update(req.body);
        console.log(updatedCategory);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await services.remove(req.body.id);
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