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

const executeQuery = async (query, params = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Помилка виконання запиту:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getTableNames = async () => {
    const query = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `;
    return await executeQuery(query);
};

const getTableStructure = async (tableName) => {
    // Перевіряємо, чи існує така таблиця для безпеки
    const tables = await getTableNames();
    const tableExists = tables.some(table => table.table_name === tableName);

    if (!tableExists) {
        throw new Error(`Таблиця "${tableName}" не існує`);
    }

    const query = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position`;

    return await executeQuery(query, [tableName]);
};

module.exports = {
    executeQuery,
    getTableNames,
    getTableStructure,
    testConnection
};