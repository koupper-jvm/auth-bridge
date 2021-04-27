const Authenticator = new (require('../security/authenticator'))();
const jwt = require('../security/jwt-generator')

module.exports = {
    login(req, res) {
        Authenticator.authenticate(req.body.email, req.body.password, res, (user) => {
            req.session.isAuthenticated = true;
            res.setHeader('access_token', jwt(user));
            res.send();
        });
    }
}
