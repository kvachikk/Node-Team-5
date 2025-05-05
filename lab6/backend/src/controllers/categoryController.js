const categoryService = require('../services/categoryService');

const categoryController = {
  getAllCategories: async (req, res, next) => {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json({
        status: 'success',
        data: categories
      });
    } catch (error) {
      next(error);
    }
  },
  
  getAllCategoriesPaginated: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 3;
      
      const result = await categoryService.getAllCategoriesPaginated(page, limit);
      
      res.status(200).json({
        status: 'success',
        data: result.categories,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },
  
  getCategoryById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      res.status(200).json({
        status: 'success',
        data: category
      });
    } catch (error) {
      next(error);
    }
  },
  
  createCategory: async (req, res, next) => {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        status: 'success',
        data: category
      });
    } catch (error) {
      next(error);
    }
  },
  
  updateCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body);
      res.status(200).json({
        status: 'success',
        data: category
      });
    } catch (error) {
      next(error);
    }
  },
  
  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController; 