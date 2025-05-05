const { sequelize, testConnection } = require('./src/config/database');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();