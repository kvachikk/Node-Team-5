const { executeQuery } = require('../database/services');

const getAll = async () => {
    const result = await executeQuery('SELECT * FROM categories');
    return result || null;
};

const getById = async (id) => {
    const results = await executeQuery('SELECT * FROM categories WHERE id = $1', [id]);
    return results[0] || null;
};

const getCategoriesByGlobalCategory = async (id) => {
    const results = await executeQuery('SELECT * FROM categories WHERE global_category_id = $1', [id]);
    return results || null;
};

const create = async (categoryData) => {
    const { name, description, image_url, global_category_id } = categoryData;
    const parsedGlobalCategoryId = global_category_id === "" ? null : parseInt(global_category_id, 10);

    const query = `INSERT INTO categories (name, description, image_url, global_category_id)
                   VALUES ($1, $2, $3, $4)
                   RETURNING *`;
    const results = await executeQuery(query, [name, description, image_url, parsedGlobalCategoryId]);
    return results[0];
};

const update = async (data) => {
    const { id, name, description, image_url, global_category_id } = data;
    const query = `UPDATE categories SET name = $1, description = $2, image_url = $3, global_category_id = $4 WHERE id = $5`;
    const results = await executeQuery(query, [name, description, image_url, global_category_id, id]);
    return results[0];
};

const remove = async (id) => {
    const results = await executeQuery('DELETE FROM categories WHERE id = $1', [id]);
    return results[0];
};

module.exports = {
    getAll,
    getById,
    getCategoriesByGlobalCategory,
    create,
    update,
    remove,
};
