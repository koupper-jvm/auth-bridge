const jwt = require('jwt-simple');
const moment = require('moment');
const sharedSecret = process.env.SHARED_SECRET;
const secret = process.env.JWT_SECRET;
const gcm = require('node-aes-gcm');
const secureRandom = require('secure-random');

const createFromSignedUser = async function (user) {
    await user.reload();

    const roles = await user.getRoles();

    const userRoles = [];

    roles.forEach(element => {
        userRoles.push(element.name);
    });

    const encryptionSecret = Buffer.from(sharedSecret);

    const IV = secureRandom.randomBuffer(16);

    let payload = {
        ui: gcm.encrypt(encryptionSecret, IV, Buffer.from(JSON.stringify({
            userId: user.id,
            roles: userRoles,
        })), new Buffer([])),
        expiresAt: moment().add(15, 'minute').valueOf(),
        iv: IV
    };

    return jwt.encode(payload, secret, 'HS256');
}

const refresh = async function (data) {
    data.expiredAt = moment().add(15, 'minute').valueOf();

    let payload = {
        ui: data.ui,
        expiresAt: data.expiredAt,
        iv: data.iv
    };

    return jwt.encode(payload, secret, 'HS256');
}
const decode = (token) => {
    return jwt.decode(token, secret, 'HS256');
}

module.exports = {createFromSignedUser, refresh, decode};
