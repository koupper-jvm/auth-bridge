'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('roles', [
            {
                name: 'ADMIN',
                description: 'The admin system',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'CUSTOMER',
                description: 'An apprentice',
                created_at: new Date(),
                updated_at: new Date()
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('roles', null, {});
    }
};
