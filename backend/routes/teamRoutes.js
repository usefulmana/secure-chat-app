const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Team } = require('../models/Team');
const { Channel } = require('../models/Channel');
const { createErrorObject, checkCreateTeamFields } = require('../middleware/authenticate');


// Create A Team
router.post('/create', passport.authenticate('jwt', { session: false }), checkCreateTeamFields , 
async(req, res) => {
    let errors = [];

    const newTeam = new Team({
        name: req.body.teamName,
        description: req.body.description,
        owner: req.user.id
    });

    newTeam.save( err => {

        if (err) console.log(err);

        const newChannel = new Channel({
            name: 'general',
            isPrivate: false,
            owner: req.user.id
        });

        newChannel.save( err => {
            if (err) console.log(err);
        });
    }) 

    res.status(200).json(newTeam);
});




module.exports = router;