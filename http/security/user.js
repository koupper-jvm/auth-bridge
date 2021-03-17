const credential = require('../../db/models/credentials');
const { Op } = require("sequelize");

class User {
    authenticate(user, password, response, callback) {
        credential.findAll({
            where: {
                [Op.and]: [
                    { email: user },
                    { password: password }
                ]
            }
        }).then(res => {
            if(res.length === 0) {
                response.json({
                    error: 'Email o password incorrectos'
                });

                return;
            }

            callback(res);
        });
    }
}

module.exports = User;
