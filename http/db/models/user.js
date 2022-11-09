const bcrypt = require('bcrypt');
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      super.belongsToMany(models.Role, {
        foreignKey: 'user_id',
        through: 'users_roles',
      });
    }

    static validPassword(password, secondPassword) {
      return bcrypt.compareSync(password, secondPassword);
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    underscored: true,
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });

  return User;
};
