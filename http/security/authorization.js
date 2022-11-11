const jwt = require('./jwt-generator');
const moment = require('moment');
const sharedSecret = process.env.SHARED_SECRET;
const gcm = require('node-aes-gcm');
const {User, UsersInfo, UsersRoles} = require('../index').db;

const routesGuides = async (req, res) => {
    const routesGuide = async (token) => {
        try {
            let data = jwt.decode(token);

            if (moment(data.expiresAt).isBefore(moment.now())) {
                return res.status(401).json({
                    message: 'UNAUTHORIZED'
                });
            }

            let guides = [];

            let ui = await gcm.decrypt(Buffer.from(sharedSecret), Buffer.from(data.iv), Buffer.from(data.ui.ciphertext.data), new Buffer([]), Buffer.from(data.ui.auth_tag.data));

            let userInfo = JSON.parse(ui.plaintext);

            userInfo.roles.forEach(role => {
                if (role === 'CUSTOMER') {
                    guides.push('rg1');
                }
            });

            res.status(200).json({
                rg: guides
            });
        } catch (e) {
            return e;
        }
    }

    return routesGuide(req.query.at);
}

const signUp = async (req, res) => {
    try {
        const result = await User.findOne({
            where: {
                email: req.body.user
            },
        });

        if (result) {
            res.status(409).json({
                message: 'USER_ALREADY_EXIST'
            });
        }

        const user = await User.create({
            username: '@' + req.body.user.slice(0, req.body.user.indexOf('@')),
            email: req.body.user,
            password: req.body.password,
        });


        await UsersRoles.create({
            userId: user.id, // the fields are case sensitive
            roleId: 2
        });

        await UsersInfo.create({
            data: req.body.data ? req.body.data : {},
            userId: user.id
        });

        const token = await jwtHandler.createFromSignedUser(user);

        res.status(201).json({
            profileInfo: {
                email: user.email,
                userName: user.username,
            },
            at: token,
        });
    } catch (e) {
        return e;
    }
}

module.exports = {routesGuides, signUp}
