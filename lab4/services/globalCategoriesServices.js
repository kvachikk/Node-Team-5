const { executeQuery } = require('../database/services');

const getAllGlobalCategories = async () => {
    return await executeQuery('SELECT * FROM global_categories');
};

const createGlobalCategory = async (categoryData) => {
    const { name, description, image_url } = categoryData;
    const query = 'INSERT INTO global_categories (name, description, image_url) VALUES ($1, $2, $3) RETURNING *';
    const results = await executeQuery(query, [name, description, image_url]);
    return results[0];
};

const updateGlobalCategory = async (id, categoryData) => {
    const { name, description, image_url } = categoryData;
    const query = `
        UPDATE global_categories
        SET name = $1, description = $2, image_url = $3
        WHERE id = $4
        RETURNING *
    `;
    const results = await executeQuery(query, [name, description, image_url, id]);
    return results[0] || null;
};

const deleteGlobalCategory = async (id) => {
    const query = 'DELETE FROM global_categories WHERE id = $1 RETURNING *';
    const results = await executeQuery(query, [id]);
    return results[0] || null;
};

module.exports = {
    createGlobalCategory,
    getAllGlobalCategories,
}