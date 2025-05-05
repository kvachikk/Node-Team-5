const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'categories',
  underscored: true
});

Category.belongsToMany(Category, {
  as: 'parents',
  through: 'category_relationships',
  foreignKey: 'child_id',
  otherKey: 'parent_id',
});

Category.belongsToMany(Category, {
  as: 'children',
  through: 'category_relationships',
  foreignKey: 'parent_id',
  otherKey: 'child_id',
});

module.exports = Category; 