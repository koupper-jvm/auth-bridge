const authenticationManagerController = require('../controllers/authentication');
const userController = require('../controllers/users');

module.exports = (app) => {
    app.post('/login', authenticationManagerController.login);
    app.post('/signIn', userController.signUp);
};