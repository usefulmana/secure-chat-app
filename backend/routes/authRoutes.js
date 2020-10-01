const _ = require("lodash");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const gravatar = require("gravatar");
const socialAuthActions = require('../actions/socialAuthActions');
const { sendEMail } = require('../utils/email');
const { checkPassword } = require('../utils/passwordChecker');

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
router.post("/register", (req, res) => {
    let errors = [];

    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).send({error: "Email is taken"}).end()

        } else {
            // ** Assign A Random Avatar **
            const avatar = gravatar.url(req.body.email, {
                s: 220,
                r: "pg",
                d: "identicon",
            });

            if (!checkPassword(req.body.password)){
                return res.status(400).send({error: "Weak Password"}).end()
            };

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                image: "https://" + avatar.substr(2),
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
router.get('/google/redirect', passport.authenticate('google', {failureRedirect: '/login'}), (req, res) => {
    const token = jwt.sign(req.user.details.toObject(), process.env.JWT_SECRET, {
        expiresIn: 18000
    });
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`)
});
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    const token = jwt.sign(req.user.details.toObject(), process.env.JWT_SECRET, {
        expiresIn: 18000
    });
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`)
});
module.exports = router;