'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UsersRoles extends Model {
    }

    UsersRoles.init({
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        roleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'role',
                key: 'id'
            }
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
        modelName: 'UsersRoles',
        tableName: 'users_roles'
    });

    return UsersRoles;
};
