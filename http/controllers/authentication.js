const AuthenticateUser = new (require('../security/user-authentication'))();
const jwt = require('../security/jwt-generator')

module.exports = {
    login(req, res) {
        AuthenticateUser.authenticate(req.body.email, req.body.password, res, (user) => {
            req.session.isAuthenticated = true;
            res.setHeader('access_token', jwt(user));
            res.send();
        });
    }
}
