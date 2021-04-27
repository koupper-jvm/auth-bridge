const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('dashboard', 'root', 'root', {
  host: 'localhost',
  dialect: 'postgres',
});

const Credential = sequelize.define('credential', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},{
  // Other model options go here

  freezeTableName: true,
  tableName: 'credentials'
});

module.exports = Credential;
