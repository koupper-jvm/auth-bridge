const authenticationManagerController = require('../controllers/authentication');

module.exports = (app) => {
    app.post('/login', authenticationManagerController.login);
    app.post('/signIn', authenticationManagerController.signIn);
};