'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            super.belongsToMany(models.User, {
                foreignKey: 'role_id',
                through: 'users_roles',
            });
        }
    }

    Role.init({
        name: DataTypes.STRING,
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
        modelName: 'Role',
        tableName: 'roles'
    });

    return Role;
};