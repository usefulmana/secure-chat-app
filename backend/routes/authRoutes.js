const _ = require("lodash");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const gravatar = require("gravatar");
const socialAuthActions = require('../actions/socialAuthActions');
const { sendEMail } = require('../utils/email');
const { checkPassword } = require('../utils/passwordChecker');
const { checkEmail } = require('../utils/emailChecker');
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

    const {email , username, password} = req.body;

    if (!email || !username || !password){
        return res.status(400).send({error: "Some fields are missing"}).end()
    }

    if (!checkEmail(email)){
        return res.status(400).send({error: "Invalid Email"}).end()
    }

    if (username.length < 5 || username.length > 50){
        return res.status(400).send({error: "Username must be between 5 and 50 characters"}).end()
    }

    if (password.length < 5 || password.length > 15){
        return res.status(400).send({error: "Password must be between 5 and 15 characters"}).end()
    }

    if (!checkPassword(password)){
        return res.status(400).send({error: "Weak Password"}).end()
    };

    User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(400).send({error: "Email is taken!"}).end()

        } else {
            // ** Assign A Random Avatar **
            const avatar = gravatar.url(email, {
                s: 220,
                r: "pg",
                d: "identicon",
            });

            if (!checkPassword(password)){
                return res.status(400).send({error: "Weak Password!"}).end()
            };


            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                image: avatar.substr(2),
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
 router.post('/login', async(req, res) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).send({error: "Some fields are messing"}).end();
    }

    if (!checkEmail(req.body.email)){
        return res.status(400).send({error: "Invalid Email"}).end()
    }

    const user = await User.findOne({ email: req.body.email }).select('-password').populate('servers');

    
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