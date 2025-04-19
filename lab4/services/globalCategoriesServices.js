const { executeQuery } = require('../database/services');

const getAll = async () => {
    return await executeQuery('SELECT * FROM global_categories');
};

const getById = async (id) => {
    const query = 'SELECT * FROM global_categories WHERE id = $1';
    const results = await executeQuery(query, [id]);
    return results[0];
};

const create = async (data) => {
    const { name, description, image_url } = data;
    const query = 'INSERT INTO global_categories (name, description, image_url) VALUES ($1, $2, $3) RETURNING *';
    const results = await executeQuery(query, [name, description, image_url]);
    return results[0];
};

const update = async (data) => {
    const { id, name, description, image_url } = data;
    const query = `
        UPDATE global_categories
        SET name = $1, description = $2, image_url = $3
        WHERE id = $4`;
    const results = await executeQuery(query, [name, description, image_url, id]);
    return results[0];
};

const remove = async (id) => {
    const results = await executeQuery('DELETE FROM global_categories WHERE id = $1', [id]);
    return results[0];
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};