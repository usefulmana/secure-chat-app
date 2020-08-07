const express = require('express');
const router = express.Router();

const passport = require('passport');

const { User } = require('../models/User');


router.get('/current', passport.authenticate('jwt', { session: false }), async(req, res) => {
    const user = await User.findById(req.user.id).populate('teams').select('-password');

    return res.status(200).json(user);
 });


module.exports = router;