const services = require('../services/globalCategoriesServices');

const showCreateForm = async (req, res) => {
    res.render('createGlobalCategoryForm', {title: 'Нова категорія'});
};

const showUpdateForm = async (req, res) => {
    const category = await services.getById(req.params.id);
    res.render('updateGlobalCategoryForm', {category: category});
};

const getAll = async (req, res) => {
    const data = await services.getAll();
    res.render('welcome', {title: 'Welcome', data: data});
};

const create = async(req, res) => {
    try {
        const newCategory = await services.create({name: req.body.name, description: req.body.description, image_url: req.body.image_url});
        if(newCategory) res.redirect('/');
    } catch (error) {
        res.status(500).json({ success: false });
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

module.exports = {
    getAll,
    create,
    update,
    remove,
    showCreateForm,
    showUpdateForm
};