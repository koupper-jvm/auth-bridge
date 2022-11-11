const {login} = require('./../security/authentication');
const {checkInToken} = require('./../security/validation');
const {routesGuides, signUp} = require('./../security/authorization');

const routes = (app) => {
    /*
    |-------------------------------------------------------
    | Login
    |-------------------------------------------------------
    */
    app.post('/login', login);

    /*
    |-------------------------------------------------------
    | SignUp
    |-------------------------------------------------------
    */
    app.post('/sign-up', signUp);

    /*
    |-------------------------------------------------------
    | Validate token
    |-------------------------------------------------------
    */
    app.post('/check-in-token', checkInToken);

    /*
    |-------------------------------------------------------
    | Routes guides
    |-------------------------------------------------------
    */
    app.post('/routes-guides', routesGuides);

    /*
    |-------------------------------------------------------
    | Health check
    |-------------------------------------------------------
    */
    app.get('/health-check', (req, res) => {
        res.send('Application UP!')
    });
}

module.exports = {routes}
