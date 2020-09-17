const passport = require('passport');
const { User } = require('../models/User');

const createErrorObject = errors => {
    const errorObject = [];
    errors.forEach(error => {
        let err = {
            [error.param]: error.msg
        };
        errorObject.push(err);
    });

    return errorObject;
};

const checkRegistrationFields = async (req, res, next) => {
    req.check('email').isEmail();
    req.check('username')
        .isString()
        .isLength({ min: 5, max: 50 })
        .withMessage('Username must be between 5 and 50 characters');
    req.check('password')
        .isString()
        .isLength({ min: 5, max: 15 })
        .withMessage('Password must be between 5 and 15 characters');

    let errors = req.validationErrors() || [];

    if (errors.length > 0) {
        res.status(400).send({
            errors: createErrorObject(errors)
        });
    } else {
        next();
    }
};

const checkLoginFields = async (req, res, next) => {
    let errors = [];
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({message: "Invalid Details Entered"})
    } else {
        if (req.body.password !== null && !(await user.isValidPassword(req.body.password))) {
            return res.status(400).send({message: "Invalid Details Entered"})
        }
    }

    if (errors.length !== 0) {
        res.status(400).send({
            errors: createErrorObject(errors)
        });
    } else {
        next();
    }
};

const checkEditProfileFields = async (req, res, next) => {
    let errors = [];

    if (req.body.email) {
        if (await User.findOne({ email: req.body.email })) {
            errors.push({ param: 'email', msg: 'Email is already taken' });
        }
    }

    if (errors.length !== 0) {
        res.status(400).send({
            errors: createErrorObject(errors)
        });
    } else {
        next();
    }
};

const checkCreateTeamFields = async (req, res, next) => {
    if (!req.body.name) {
        req.check('name')
            .not()
            .isEmpty()
            .withMessage('Server name is required');
    } else {
        req.check('name')
            .isString()
            .isLength({ min: 4, max: 50 })
            .withMessage('Server name must be between 4 and 50 characters');
    }
    const errors = req.validationErrors();

    if (errors) {
        res.send({
            errors: createErrorObject(errors)
        });
    } else {
        next();
    }
};

const customSocialAuthenticate = socialAuth => {
    return (req, res, next) => {
        passport.authenticate(socialAuth, {
            state: JSON.stringify({ _socket: req.query.socketId })
        })(req, res, next);
    };
};

module.exports = {
    checkLoginFields,
    checkRegistrationFields,
    checkEditProfileFields,
    createErrorObject,
    checkCreateTeamFields, 
    customSocialAuthenticate
};
