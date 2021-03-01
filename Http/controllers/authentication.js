const AuthenticateUser = new (require('../security/authenticatesUsers'))();
const jwt = require('../security/jwtGenerate')

module.exports = {
    login(req, res) {

        AuthenticateUser.authenticate(req.body.email, req.body.password, res, (user) => {
            req.session.isAuthenticated = true;
            res.setHeader('JWToken', jwt(user));
            res.send();
        });

        /*

        //Create jwt token

        const token = createToken();
        console.log(token);

        // Add isAuthenticade to session

        console.log(req.body, 'Here');
        req.session.isAuthenticated = true;
        console.log(req.session.isAuthenticated, 'Authenticated');
        res.send('success')

         */
    }
}