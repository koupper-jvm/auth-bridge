'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function setupDB() {
    const Sequelize = require('sequelize');

    let sequelize = new Sequelize(require(path.join(__dirname, '/db/config/config.json'))[process.env.NODE_ENV || 'development']);

    const db = {};

    fs.readdirSync(path.join(__dirname, '/db/models'))
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            const model = require(path.join(__dirname, `/db/models/${file}`))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
}

function setupRoutes(app) {
    fs.readdirSync(path.join(__dirname, '/routes'))
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            if (!file.includes('paths')) {
                require(path.join(__dirname, `/routes/${file}`)).routes((app));
            }
        });
}

function loadControllers() {
    const controllers = {};

    fs.readdirSync(path.join(__dirname, '/controllers'))
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            controllers[file.slice(0, file.indexOf('.'))] = require(path.join(__dirname, `/controllers/${file}`));
        });

    return controllers;
}

module.exports = (app) => {
    setupRoutes(app)
};

dotenv.config({ path: __dirname + '/security/.env' });

module.exports.jwt = require('./security/jwt-generator');

module.exports.db = setupDB();

module.exports.controllers = loadControllers();

module.exports.authentication = require('./security/authentication');

module.exports.authorization = require('./security/authorization');
