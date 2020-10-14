const jwt = require('jsonwebtoken');

module.exports = {
    google: (req, res) => {

        const token = jwt.sign(req.user.details.toObject(), process.env.JWT_SECRET, {
            expiresIn: 18000
        });
        res.status(200).send({token: `Bearer ${token}`})
    },
    facebook: (req, res) => {
        const token = jwt.sign(req.user.details.toObject(), process.env.JWT_SECRET, {
            expiresIn: 18000
        });
        res.status(200).send({token: `Bearer ${token}`})

    }
};