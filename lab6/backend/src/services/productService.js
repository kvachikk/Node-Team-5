const productRepository = require('../repositories/productRepository');
const categoryService = require('./categoryService');
const { generateSlug } = require('../utils/stringUtils');
const { sequelize } = require('../config/database');

class ProductService {
  async getAllProducts(options = {}) {
    return productRepository.findAll(options);
  }

  async getAllProductsPaginated(page = 1, limit = 3, options = {}) {
    return productRepository.findAllPaginated(page, limit, options);
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async createProduct(data) {
    const transaction = await sequelize.transaction();
    
    try {
      await categoryService.getCategoryById(data.categoryId);
      
      const slug = generateSlug(data.name);

      const existingProduct = await productRepository.findBySlug(slug);
      if (existingProduct) {
        const error = new Error('A product with this name already exists');
        error.statusCode = 409;
        throw error;
      }
      
      const product = await productRepository.create({ ...data, slug }, { transaction });
      
      await transaction.commit();
      return product;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateProduct(id, data) {
    const transaction = await sequelize.transaction();
    
    try {
      await this.getProductById(id);
      
      let updateData = { ...data };
      
      if (data.categoryId) {
        await categoryService.getCategoryById(data.categoryId);
      }
      
      if (data.name) {
        updateData.slug = generateSlug(data.name);
        
        const existingProduct = await productRepository.findBySlug(updateData.slug);
        if (existingProduct && existingProduct.id !== parseInt(id)) {
          const error = new Error('A product with this name already exists');
          error.statusCode = 409;
          throw error;
        }
      }
      
      const result = await productRepository.update(id, updateData, { transaction });
      
      await transaction.commit();
      return result.updatedItems[0];
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteProduct(id) {
    const transaction = await sequelize.transaction();
    
    try {
      await this.getProductById(id);
      
      const result = await productRepository.delete(id, { transaction });
      
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getProductsByCategory(categoryId) {
    await categoryService.getCategoryById(categoryId);
    
    return productRepository.findByCategoryId(categoryId);
  }

  async getProductsByCategoryPaginated(categoryId, page = 1, limit = 3) {
    await categoryService.getCategoryById(categoryId);
    
    return productRepository.findByCategoryIdPaginated(categoryId, page, limit);
  }

  async searchProducts(query) {
    return productRepository.search(query);
  }
  
  async bulkCreateProducts(productsData, categoryId) {
    const transaction = await sequelize.transaction();
    
    try {
      // Перевірка існування категорії
      await categoryService.getCategoryById(categoryId);
      
      // Генеруємо slug для кожного продукту і додаємо categoryId
      const productsToCreate = productsData.map(product => ({
        ...product,
        slug: generateSlug(product.name),
        categoryId
      }));
      
      // Перевірка на унікальність імен продуктів
      const slugs = productsToCreate.map(p => p.slug);
      const existingProducts = await productRepository.findBySlugs(slugs);
      
      if (existingProducts.length > 0) {
        const existingNames = existingProducts.map(p => p.name).join(', ');
        const error = new Error(`Some products already exist: ${existingNames}`);
        error.statusCode = 409;
        throw error;
      }
      
      // Створення всіх продуктів як частина однієї транзакції
      const createdProducts = [];
      
      for (const productData of productsToCreate) {
        // Імітація помилки для демонстрації відкату транзакції при певних умовах
        if (productData.simulateError) {
          throw new Error('Simulated error for transaction rollback demonstration');
        }
        
        const product = await productRepository.create(productData, { transaction });
        createdProducts.push(product);
      }
      
      await transaction.commit();
      return createdProducts;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new ProductService(); 