const jwt = require('jwt-simple');
const moment = require('moment');
const secret = Buffer.from(process.env.JWT_SECRET, 'hex')

module.exports.create = async (user) => {
    const roles = await user.getRoles();

    const userRoles = [];

    roles.forEach(element => {
        userRoles.push(element.name);
    });

    let payload = {
        userId: user.id,
        createdAt: moment().unix(),
        roles: userRoles,
        expiresAt: moment().add(1, 'day').unix()
    }

    return jwt.encode(payload, secret, 'HS256');
};

module.exports.decode = (token) => {
    return jwt.decode(token, secret, 'HS256');
}
