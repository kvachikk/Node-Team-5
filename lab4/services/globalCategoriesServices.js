const { executeQuery, beginTransaction, commitTransaction, rollbackTransaction } = require('../database/services');

const getAll = async () => {
    return await executeQuery('SELECT * FROM global_categories');
};

const getById = async (id) => {
    const query = 'SELECT * FROM global_categories WHERE id = $1';
    const results = await executeQuery(query, [id]);
    return results[0];
};

const create = async (data) => {
    const client = await beginTransaction();

    try {
        const { name, description, image_url } = data;
        const query = 'INSERT INTO global_categories (name, description, image_url) VALUES ($1, $2, $3) RETURNING *';

        const results = await client.query(query, [name, description, image_url]);

        await commitTransaction(client);
        return results.rows[0];
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

const update = async (data) => {
    const client = await beginTransaction();

    try {
        const { id, name, description, image_url } = data;
        const query = `
            UPDATE global_categories
            SET name = $1, description = $2, image_url = $3
            WHERE id = $4
            RETURNING *`;

        const results = await client.query(query, [name, description, image_url, id]);

        await commitTransaction(client);
        return results.rows[0];
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

const remove = async (id) => {
    const client = await beginTransaction();

    try {
        const checkQuery = 'SELECT COUNT(*) FROM categories WHERE global_category_id = $1';
        const checkResult = await client.query(checkQuery, [id]);

        if (parseInt(checkResult.rows[0].count) > 0) {
            throw new Error('Неможливо видалити глобальну категорію, яка містить категорії');
        }

        const query = 'DELETE FROM global_categories WHERE id = $1 RETURNING *';
        const results = await client.query(query, [id]);

        await commitTransaction(client);
        return results.rows[0];
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};