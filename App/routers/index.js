const authenticationManagerController = require('../controllers/authentication');
const users = require('../controllers/users');

module.exports = (app) => {
    app.post('/login', authenticationManagerController.login);
    app.post('/signIn', users.signIn);
};