const jwt = require('jwt-simple');
const moment = require('moment');

module.exports = (user) => {
    let secret = Buffer.from('NPYnBp1UJM', "hex");
    let payload = {
        userId: user[0].dataValues.id,
        createdAt: moment().unix(),
        expiresAt: moment().add(1, 'day').unix()
    }

    return jwt.encode(payload, secret ,'HS512');
};