const { executeQuery, beginTransaction, commitTransaction, rollbackTransaction } = require('../database/services');

// Отримати всі категорії
const getAll = async () => {
    return await executeQuery('SELECT * FROM categories');
};

// Отримати категорію за ID
const getById = async (id) => {
    const result = await executeQuery('SELECT * FROM categories WHERE id = $1', [id]);
    return result[0] || null;
};

// Отримати категорії за глобальною категорією
const getCategoriesByGlobalCategory = async (globalCategoryId) => {
    return await executeQuery('SELECT * FROM categories WHERE global_category_id = $1', [globalCategoryId]);
};

// Створити нову категорію
const create = async (categoryData) => {
    const client = await beginTransaction();
    try {
        const { name, description, image_url, global_category_id } = categoryData;
        const parsedGlobalCategoryId = global_category_id === "" ? null : parseInt(global_category_id, 10);

        const query = `
            INSERT INTO categories (name, description, image_url, global_category_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await client.query(query, [name, description, image_url, parsedGlobalCategoryId]);
        await commitTransaction(client);
        return result.rows[0];
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

// Оновити категорію
const update = async (data) => {
    const client = await beginTransaction();
    try {
        const { id, name, description, image_url, global_category_id } = data;

        const query = `
            UPDATE categories
            SET name = $1, description = $2, image_url = $3, global_category_id = $4
            WHERE id = $5
            RETURNING *
        `;

        const result = await client.query(query, [name, description, image_url, global_category_id, id]);
        await commitTransaction(client);
        return result.rows[0];
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

// Видалити категорію
const remove = async (id) => {
    const client = await beginTransaction();
    try {
        const result = await client.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        await commitTransaction(client);
        return result.rows[0];
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

// Отримати всі глобальні категорії
const getGlobalCategories = async () => {
    return await executeQuery('SELECT * FROM global_categories');
};

// Отримати список категорій разом з назвами глобальних категорій
const getJoinedListCategories = async () => {
    return await executeQuery(`
        SELECT c.id, c.name, c.global_category_id, g.name as global_category_name
        FROM categories c
        LEFT JOIN global_categories g ON c.global_category_id = g.id
        ORDER BY c.name
    `);
};

// Перемістити категорії до нової глобальної категорії
const moveCategoriesToNewGlobal = async (categoryId, newGlobalId) => {
    const client = await beginTransaction();
    try {
        const result = await client.query(
            'UPDATE categories SET global_category_id = $1 WHERE id = $2 RETURNING *',
            [newGlobalId, categoryId]
        );
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
    getCategoriesByGlobalCategory,
    create,
    update,
    remove,
    getGlobalCategories,
    getJoinedListCategories,
    moveCategoriesToNewGlobal,
};