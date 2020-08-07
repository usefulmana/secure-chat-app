const express = require('express');
const router = express.Router();

const passport = require('passport');

const { User } = require('../models/User');
const { result } = require('lodash');

// Get Current User
router.get('/current', passport.authenticate('jwt', { session: false }), async(req, res) => {
    const user = await User.findById(req.user.id).populate('teams').select('-password');

    return res.status(200).json(user);
 });


// Change password
router.post('/change-pw', passport.authenticate('jwt', {session: false}), async(req, res) => {

    User.findById(req.user.id)
    .then( u => {
        u.password = req.body.password;

        u.save()
        .then( result => res.status(200).send({ success: true }))
    });

});

module.exports = router;