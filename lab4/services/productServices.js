const { executeQuery, beginTransaction, commitTransaction, rollbackTransaction } = require('../database/services');

const getAll = async () => {
    return await executeQuery('SELECT * FROM products');
};

const getById = async (id) => {
    const results = await executeQuery('SELECT * FROM products WHERE id = $1', [id]);
    return results[0] || null;
};

const getAllByCategoryId = async (id) => {
    return (await executeQuery('SELECT * FROM products WHERE category_id = $1', [id])) || null;
};

const create = async (productData) => {
    const client = await beginTransaction();

    try {
        const { name, description, image_url, price, stock_quantity, category_id } = productData;
        const query = `
            INSERT INTO products (name, description, image_url, price, stock_quantity, category_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const results = await client.query(query, [
            name, description, image_url, price, stock_quantity, category_id
        ]);

        await commitTransaction(client);
        return results.rows[0];
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

const update = async (id, productData) => {
    const client = await beginTransaction();

    try {
        const { name, description, image_url, price, stock_quantity, category_id } = productData;
        const query = `
            UPDATE products
            SET name = $1, description = $2, image_url = $3, 
                price = $4, stock_quantity = $5, category_id = $6
            WHERE id = $7
            RETURNING *
        `;

        const results = await client.query(query, [
            name, description, image_url, price, stock_quantity, category_id, id
        ]);

        await commitTransaction(client);
        return results.rows[0] || null;
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

const remove = async (id) => {
    const client = await beginTransaction();

    try {
        const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const results = await client.query(query, [id]);

        await commitTransaction(client);
        return results.rows[0] || null;
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
};

const search = async (searchTerm) => {
    return await executeQuery(`SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY name`, [`%${searchTerm}%`]);
};

module.exports = {
    getAll,
    getById,
    getAllByCategoryId,
    create,
    update,
    remove,
    search
};