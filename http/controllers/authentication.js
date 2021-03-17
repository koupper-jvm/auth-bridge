const AuthenticateUser = new (require('../security/user'))();
const jwt = require('../security/jwtGenerate')

module.exports = {
    login(req, res) {
        user.authenticate(req.body.email, req.body.password, res, (user) => {
            req.session.isAuthenticated = true;
            res.setHeader('access_token', jwt(user));
            res.send();
        });
    }
}
