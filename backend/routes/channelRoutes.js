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

//Delete Channel
router.delete("/delete", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { channelName, serverId } = req.body;

        const server = await Server.findById(serverId);
        if (server.channels.find({ Channel: req.channelName })) {
            Channel.findByIdAndDelete(req.channelName.id, function (err, result) {
                if (err) {
                    res.status(404);
                    res.send('Channel could not be deleted');
                } else {
                    res.status(200);
                    res.send('Channel deleted successfully');
                }
            });
        } else {
            res.status(404);
            res.send('Channel not in server');
        }

    })


module.exports = router;