const bcrypt = require('bcrypt');
const User = require('../index').db.User;
const UserRoles = require('../index').db.UsersRoles;
const jwt = require('../index').jwt;


User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => {
            throw new Error();
        });
});

const signUp = async (req, res) => {
    const authorization = require('../index').authorization;

    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        await UserRoles.create({
            user_id: user.id,
            role_id: 2
        });

        req.session.isAuthenticated = true;
        res.cookie('access_token', await jwt.create(user), {
            maxAge: 1000 * 60 * 15
        });
        res.status(201).json({
            user,
            redirect: authorization.buildRedirectFor(req, res)
        });
    } catch (error) {
        console.log(error);
        if (error.errors[0].message === 'email must be unique') {
            return res.status(500).json({error: 'EMAIL_MUST_BE_UNIQUE'})
        }

        return res.status(500).json({error: 'GENERAL_ERROR'})
    }
}

module.exports = {signUp,}
