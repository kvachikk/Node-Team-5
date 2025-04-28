const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: 'ep-sparkling-darkness-a2vxyb6q-pooler.eu-central-1.aws.neon.tech',
    port: '5432',
    user: 'storedb_owner',
    password: 'npg_7KiYBHt9nvMr',
    database: 'storedb',
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 50000,
    connectionTimeoutMillis: 20000,
});

const testConnection = async () => {
    try {
        const result = await executeQuery("SELECT 'Віддалена база даних успішно підключена' as message");
        return result[0];
    } catch (error) {
        console.error('Помилка підключення до бази даних:', error);
        throw error;
    }
};

const executeQuery = async (text, params) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result.rows;
    } finally {
        client.release();
    }
};

const beginTransaction = async () => {
    const client = await pool.connect();
    await client.query('BEGIN');
    return client;
};

const commitTransaction = async (client) => {
    try {
        await client.query('COMMIT');
    } finally {
        client.release();
    }
};

const rollbackTransaction = async (client) => {
    try {
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
};

module.exports = {
    executeQuery,
    testConnection,
    beginTransaction,
    commitTransaction,
    rollbackTransaction
};