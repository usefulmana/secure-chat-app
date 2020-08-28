const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Server } = require("../models/Server");
const { Channel } = require("../models/Channel");
const { User } = require("../models/User");

router.post('/create', passport.authenticate("jwt", { session: false }), async (req, res) => {

    const { channelName, serverId } = req.body;

    const server = await Server.findById(serverId)
        .then(s => {
            const newChannel = Channel({
                name: channelName,
                server: serverId
            }).save().then(channel => {
                res.status(200).json(channel);
            });
        }).catch(err => res.status(404).send({ message: "Server Not Found" }));
});

// Edit Channel Name
router.put("/name", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const channel = await Channel.findById(req.channel.id).select('name');
        channel.name = req.body.name;
        channel.save().then(u => res.status(200).send(u)).catch(err => console.log(err));
    })



module.exports = router;