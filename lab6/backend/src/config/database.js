const seqConfig = require('./sequelize');
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = seqConfig[env];

console.log(`Database connection started`);
const sequelize = new Sequelize(config.url, {
  dialect: config.dialect,
  logging: config.logging,
  pool: config.pool,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // You might want to adjust this based on your security requirements
    }
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return Promise.reject(error);
  }
};

module.exports = {
  sequelize,
  testConnection
}; 