const { Op } = require('sequelize');
const { Product, Category } = require('../models');


class ProductRepository {
 
  async findAll(options = {}) {
    const defaultOptions = {
      include: [
        {
          model: Category,
          as: 'category'
        }
      ]
    };
    return Product.findAll({ ...defaultOptions, ...options });
  }

  async findAllPaginated(page = 1, limit = 3, options = {}) {
    const offset = (page - 1) * limit;
    
    const defaultOptions = {
      include: [
        {
          model: Category,
          as: 'category'
        }
      ]
    };
    
    const { count, rows } = await Product.findAndCountAll({
      ...defaultOptions,
      ...options,
      offset,
      limit,
      distinct: true
    });
    
    return {
      products: rows,
      pagination: {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit
      }
    };
  }

  /**
   * Find product by ID
   * @param {number} id - Product ID
   * @param {Object} options - Query options
   * @returns {Promise<Product>}
   */
  async findById(id, options = {}) {
    const defaultOptions = {
      include: [
        {
          model: Category,
          as: 'category'
        }
      ]
    };
    return Product.findByPk(id, { ...defaultOptions, ...options });
  }

  /**
   * Create new product
   * @param {Object} data - Product data
   * @param {Object} options - Creation options
   * @returns {Promise<Product>}
   */
  async create(data, options = {}) {
    return Product.create(data, options);
  }

  /**
   * Update product
   * @param {number} id - Product ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<[number, Product[]]>}
   */
  async update(id, data, options = {}) {
    const [affectedRows, updatedItems] = await Product.update(data, {
      where: { id },
      returning: true,
      ...options
    });
    return { affectedRows, updatedItems };
  }

  /**
   * Delete product
   * @param {number} id - Product ID
   * @param {Object} options - Delete options
   * @returns {Promise<number>}
   */
  async delete(id, options = {}) {
    return Product.destroy({ 
      where: { id },
      ...options 
    });
  }

  /**
   * Find products by category ID
   * @param {number} categoryId - Category ID
   * @returns {Promise<Product[]>}
   */
  async findByCategoryId(categoryId) {
    return Product.findAll({
      where: { categoryId },
      include: [
        {
          model: Category,
          as: 'category'
        }
      ]
    });
  }

  async findByCategoryIdPaginated(categoryId, page = 1, limit = 3) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Product.findAndCountAll({
      where: { categoryId },
      include: [
        {
          model: Category,
          as: 'category'
        }
      ],
      offset,
      limit,
      distinct: true
    });
    
    return {
      products: rows,
      pagination: {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit
      }
    };
  }

  async search(query) {
    const result = await Product.findAll({
      where: {
        name: { [Op.iLike]: `%${query.q}%` }
      },
      include: [
        {
          model: Category,
          as: 'category'
        }
      ]
    });
      return result;
  }
  
  async findBySlug(slug) {
    return Product.findOne({
      where: { slug },
     

    });
  }

  async findBySlugs(slugs) {
    return Product.findAll({
      where: { 
        slug: { 
          [Op.in]: slugs 
        } 
      }
    });
  }

  async bulkCreate(products, options = {}) {
    return Product.bulkCreate(products, {
      returning: true,
      ...options
    });
  }
}

module.exports = new ProductRepository(); 