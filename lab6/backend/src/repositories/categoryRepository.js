const { Category } = require('../models');

class CategoryRepository {
  async findAll(options = {}) {
    return Category.findAll(options);
  }

  async findAllPaginated(page = 1, limit = 3, options = {}) {
    const offset = (page - 1) * limit;
    
    const { rows, count } = await Category.findAndCountAll({
      offset,
      limit,
      ...options,
      distinct: true
    });
    
    return {
      categories: rows,
      pagination: {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit
      }
    };
  }

  async findById(id, options = {}) {
    return Category.findByPk(id, options);
  }

  async create(data, options = {}) {
    return Category.create(data, options);
  }

  async update(id, data, options = {}) {
    const [affectedRows, updatedItems] = await Category.update(data, {
      where: { id },
      returning: true,
      ...options
    });
    return { affectedRows, updatedItems };
  }

  async delete(id, options = {}) {
    return Category.destroy({ 
      where: { id },
      ...options 
    });
  }

  async findBySlug(slug) {
    return Category.findOne({ where: { slug } });
  }
}

module.exports = new CategoryRepository(); 