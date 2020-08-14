const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Team } = require('../models/Team');
const { Channel } = require('../models/Channel');
const { User } = require('../models/User');
const { createErrorObject, checkCreateTeamFields } = require('../middleware/authenticate');

// Get A Team

router.get('/:id', passport.authenticate('jwt', { session: false }), async(req, res) => {
   Team.findById(req.params.id).then( team => {

    if(!team) res.status(400).send({error: "Team does not exist!"})

    res.status(200).json(team);

   });
});

// Create A Team
router.post('/create', passport.authenticate('jwt', { session: false }), checkCreateTeamFields , 
async(req, res) => {
    let errors = [];

    const newTeam = new Team({
        name: req.body.teamName,
        description: req.body.description,
        owner: req.user.id
    });

    Team.create(newTeam)
    .then( team => {

        User.findByIdAndUpdate(req.user.id, {$push: {teams: team._id}}
            , { new: true, useFindAndModify: false})
            .then(u => {

                const newChannel = new Channel({
                    name: 'general',
                    isPrivate: false,
                    owner: req.user.id
                })
                
                Channel.create(newChannel)
                .then( channel => {
                   
                    Team.findByIdAndUpdate(team._id, { $push : { channels : channel._id}}, 
                        { new: true, useFindAndModify: false})
                        .then( finalTeam =>  res.status(200).json(finalTeam))
                        .catch(err => console.log(err));
                    
                })
                .catch(err => console.log(err));

            }).catch(err => console.log(err));

    })
    .catch(err => console.log(err));
});


// Join A Team
router.post('/join/:invCode', passport.authenticate('jwt', { session: false }), async(req, res) => {
    Team.findOne({ invitationCode: req.params.invCode}).populate('channels').then( team => {

        if(!team) res.status(400).send({error: "Team does not exist or the invitation code is invalid"});
        console.log(team.channels)
        team.channels.forEach(channel => {
            if(channel.name === 'general') {
                console.log(channel)
                console.log(channel.members.find( member => member === req.user.id));
                channel.members.find( member => member === req.user.id) === undefined ? channel.members.push(req.user.id)
                : res.status(400).send({error: 'You are already in the channel'});
                console.log(channel)
                res.status(200).send({status: 'done'})
                // console.log("here")
                // team.save()
                // console.log("after")
                // .then( t => {
                //     res.status(200).send({status: 'done'})
                // })
                // .catch(err => console.log(err));
            }        
        });
    }).catch(err => console.log(err));
});




module.exports = router;