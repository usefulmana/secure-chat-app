const _ = require("lodash");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const randomString = require("random-base64-string");
const { User } = require("../models/User");
const gravatar = require("gravatar");
const socialAuthActions = require('../actions/socialAuthActions');
const { sendEMail } = require('../utils/email');

// ** Middleware **
const {
    checkLoginFields,
    checkRegistrationFields,
    checkEditProfileFields,
    createErrorObject,
    customSocialAuthenticate
} = require("../middleware/authenticate");
const passport = require("passport");

// ** Routes **

/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *      summary: Register a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          '200':
 *              description: A successful register request
 *          '400':
 *              description: Failed Request. Something went wrong
 */
router.post("/register", [checkRegistrationFields], (req, res) => {
    let errors = [];

    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            errors.push({ param: "email", msg: "Email is already taken" });

            res.send({
                errors: createErrorObject(errors),
            }).end();
        } else {
            // ** Assign A Random Avatar **
            const avatar = gravatar.url(req.body.email, {
                s: 220,
                r: "pg",
                d: "identicon",
            });

            if (req.body.username.includes('!')){
                errors.push({ param: "username", msg: "Username cannot have '!' character" });

                res.send({
                    errors: createErrorObject(errors),
                }).end();
            };


            const newUser = new User({
                username: req.body.username + '!' + randomString(6),
                email: req.body.email,
                password: req.body.password,
                image: avatar,
            });

            newUser
                .save()
                .then((userData) => {
                    const user = _.omit(userData.toObject(), ["password"]);

                    const token = jwt.sign(user, process.env.JWT_SECRET, {
                        expiresIn: 18000,
                    });

                    if (process.env.NODE_ENV === 'production'){
                        sendEMail(user, 'verify');
                    };

                    res.status(200).send({
                        auth: true,
                        token: `Bearer ${token}`,
                        user,
                    });
                })
                .catch((err) => {
                    res.send({
                        err,
                        error:
                            "Something went wrong, Please check the fields again",
                    });
                });
        }
    });
});


/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *      summary: Login a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          '200':
 *              description: A successful register request
 *          '400':
 *              description: Failed Request. No user found or wrong password
 */
 router.post('/login', checkLoginFields, async(req, res) => {
    const user = await User.findOne({ email: req.body.email }).select('-password').populate('teams');

    
    if (!user) {
        return res.status(404).send({
            error: 'No User Found'
        });
    }

    const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, { expiresIn: 18000 });

    res.status(200).send({ auth: true, token: `Bearer ${token}`, user });

 });

// ** Social Auth Routes **
router.get('/google', passport.authenticate('google'));
router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

// ** Social Auth Callbacks **
router.get('/google/redirect', passport.authenticate('google', {failureRedirect: '/login'}), socialAuthActions.google);
router.get('/facebook/redirect', passport.authenticate('facebook'), socialAuthActions.facebook);

module.exports = router;