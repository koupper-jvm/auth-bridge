const jwt = require('../index').jwt;
const User = require('../index').db.User;
const Role = require('../index').db.Role;

const login = async (req, res) => {
    const authorization = require('../index').authorization;

    const paths = require('../routes/app').paths;

    try {
        const result = await User.findOne({
            where: {
                email: req.body.email
            },
            include: Role
        });

        if (!result) {
            throw new Error("UNREGISTERED_USER");
        }

        if (!User.validPassword(req.body.password, result.password)) {
            throw new Error("INCORRECT_PASSWORD");
        }

        req.session.isAuthenticated = true;
        res.cookie('access_token', await jwt.create(result), {
            maxAge: 1000 * 60 * 15
        });

        const roles = await result.getRoles();

        const userRoles = [];

        roles.forEach(element => {
            userRoles.push({
                name: element.name.toLowerCase(),
                home: paths['protected'][element.name.toLowerCase()].defaultPath,
            });
        });

        res.json({
            profileInfo: {
                userName: result.username,
                profiles: userRoles,
            },
            redirect: authorization.buildRedirectFor(req, res)
        })
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const logout = (req, res) => {
    req.session = null;

    res.redirect('/')
}

module.exports = {login, logout};
