const { executeQuery, beginTransaction, commitTransaction, rollbackTransaction } = require('../database/services');

// Отримати всі глобальні категорії
const getAll = async () => {
    return await executeQuery('SELECT * FROM global_categories');
};

// Отримати глобальну категорію за ID
const getById = async (id) => {
    const result = await executeQuery('SELECT * FROM global_categories WHERE id = $1', [id]);
    return result[0] || null;
};

// Створити нову глобальну категорію
const create = async (data) => {
    const client = await beginTransaction();
    try {
        const { name, description, image_url } = data;

        const query = `
            INSERT INTO global_categories (name, description, image_url)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await client.query(query, [name, description, image_url]);
        await commitTransaction(client);
        return result.rows[0];
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

// Оновити глобальну категорію
const update = async (data) => {
    const client = await beginTransaction();
    try {
        const { id, name, description, image_url } = data;

        const query = `
            UPDATE global_categories
            SET name = $1, description = $2, image_url = $3
            WHERE id = $4
            RETURNING *
        `;

        const result = await client.query(query, [name, description, image_url, id]);
        await commitTransaction(client);
        return result.rows[0];
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

// Видалити глобальну категорію
const remove = async (id) => {
    const client = await beginTransaction();
    try {
        // Перевірка на наявність дочірніх категорій
        const check = await client.query('SELECT COUNT(*) FROM categories WHERE global_category_id = $1', [id]);
        if (parseInt(check.rows[0].count) > 0) {
            throw new Error('Неможливо видалити глобальну категорію, яка містить дочірні категорії');
        }

        const result = await client.query('DELETE FROM global_categories WHERE id = $1 RETURNING *', [id]);
        await commitTransaction(client);
        return result.rows[0];
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