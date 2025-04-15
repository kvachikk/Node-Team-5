const { executeQuery } = require('../database/services');
const {query} = require("express");

const getAllProducts = async () => {
    return await executeQuery(query, params);
};

const getAllProductsByCategoryId = async (id) => {
    return (await executeQuery('SELECT * FROM products WHERE category_id = $1', [id])) || null;
};

const getProductById = async (id) => {
    return (await executeQuery('SELECT * FROM products WHERE id = $1', [id])) || null;
};

const createProduct = async (productData) => {
    const { name, description, image_url, price, stock_quantity, category_id } = productData;
    const query = `
        INSERT INTO products (name, description, image_url, price, stock_quantity, category_id)
        VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
    `;
    const results = await executeQuery(query, [
        name, description, image_url, price, stock_quantity, category_id
    ]);
    return results[0];
};

const updateProduct = async (id, productData) => {
    const { name, description, image_url, price, stock_quantity, category_id } = productData;
    const query = `
        UPDATE products
        SET name = $1, description = $2, image_url = $3, 
            price = $4, stock_quantity = $5, category_id = $6
        WHERE id = $7
        RETURNING *
    `;
    const results = await executeQuery(query, [
        name, description, image_url, price, stock_quantity, category_id, id
    ]);
    return results[0] || null;
};

const deleteProduct = async (id) => {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const results = await executeQuery(query, [id]);
    return results[0] || null;
};

const updateProductStock = async (id, quantity) => {
    const query = 'UPDATE products SET stock_quantity = $1 WHERE id = $2 RETURNING *';
    const results = await executeQuery(query, [quantity, id]);
    return results[0] || null;
};

const searchProducts = async (searchTerm) => {
    const query = `
        SELECT * FROM products
        WHERE 
            name ILIKE $1 OR
            description ILIKE $1
        ORDER BY name
    `;
    return await executeQuery(query, [`%${searchTerm}%`]);
};

module.exports = {
    getAllProducts,
    getProductById,
    getAllProductsByCategoryId,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    searchProducts
};