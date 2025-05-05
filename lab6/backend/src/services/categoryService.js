const categoryRepository = require('../repositories/categoryRepository');
const { generateSlug } = require('../utils/stringUtils');
const { sequelize } = require('../config/database');
const Category = require('../models/category');

class CategoryService {

  async getAllCategories() {
    return categoryRepository.findAll({
      include: [
        {
          model: Category,
          as: 'children', // Підкатегорії
          include: [
            {
              model: Category,
              as: 'children' // Вкладені підкатегорії
            }
          ]
        },
        {
          model: Category,
          as: 'parents', // Батьківські категорії (якщо потрібно)
        }
      ]
    });
  }

  async getAllCategoriesPaginated(page = 1, limit = 3) {
    const options = {
      include: [
        {
          model: Category,
          as: 'children', // Підкатегорії
          include: [
            {
              model: Category,
              as: 'children' // Вкладені підкатегорії
            }
          ]
        },
        {
          model: Category,
          as: 'parents', // Батьківські категорії (якщо потрібно)
        }
      ]
    };
    
    return categoryRepository.findAllPaginated(page, limit, options);
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  async createCategory(data) {
    const transaction = await sequelize.transaction();
    
    try {
      const slug = generateSlug(data.name);
      const existingCategory = await categoryRepository.findBySlug(slug);
      if (existingCategory) {
        const error = new Error('A category with this name already exists');
        error.statusCode = 409;
        throw error;
      }
      
      const category = await categoryRepository.create({ ...data, slug }, { transaction });
      
      await transaction.commit();
      return category;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }


  async updateCategory(id, data) {
    const transaction = await sequelize.transaction();
    
    try {
      const category = await this.getCategoryById(id);
      
      let updateData = { ...data };
      
      if (data.name) {
        updateData.slug = generateSlug(data.name);
        
        const existingCategory = await categoryRepository.findBySlug(updateData.slug);
        
        if (existingCategory && existingCategory.id !== parseInt(id)) {
          const error = new Error('A category with this name already exists');
          error.statusCode = 409;
          throw error;
        }
      }
      
      const result = await categoryRepository.update(id, updateData, { transaction });
      
      await transaction.commit();
      return result.updatedItems[0];
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteCategory(id) {
    const transaction = await sequelize.transaction();
    
    try {
      await this.getCategoryById(id);
      
      const result = await categoryRepository.delete(id, { transaction });
      
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new CategoryService(); 