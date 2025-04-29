const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
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