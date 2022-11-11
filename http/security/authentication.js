const {Role, User} = require('../index').db;
const jwt = require('./jwt-generator');

const login = async (req, res) => {
    let login = async (email, password) => {
        try {
            const result = await User.findOne({
                where: {
                    email: email,
                },
                include: Role,
            });

            if (!result) {
                return res.status(404).json({
                    message: "USER_NOT_FOUND",
                });
            }

            if (!User.validPassword(password, result.password)) {
                return res.status(401).json({
                    message: "WRONG_PASSWORD",
                });
            }

            let token = await jwt.createFromSignedUser(result)

            res.status(200).json({
                profileInfo: {
                    email: result.email,
                    userName: result.username,
                },
                at: token,
            });

        } catch (e) {
            res.status(503).json({
                message: "AN_ERROR_FOUND",
            });
        }
    };

    return login(req.body.user, req.body.password);
}

module.exports = {login}
