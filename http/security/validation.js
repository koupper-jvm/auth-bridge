const jwt = require('./jwt-generator');
const moment = require('moment');

const checkInToken = async (req, res) => {
    const checkinToken = async (token) => {
        try {
            let data = jwt.decode(token);

            // Cause expiresAt is in 15 min, this condition is true, if not, is because the token was not refreshed and
            // it does not have a future time.
            if (moment(data.expiresAt).isSameOrAfter(moment.now())) {
                res.status(200).json({
                    at: await jwt.refresh(data),
                });
            } else {
                res.status(202).json({
                    message: 'INVALID_TOKEN',
                });
            }
        } catch (e) {
            return e;
        }
    }

    return checkinToken(req.query.at);
}

module.exports = {checkInToken}
