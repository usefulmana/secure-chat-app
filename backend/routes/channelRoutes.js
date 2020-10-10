const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Server } = require("../models/Server");
const { Channel } = require("../models/Channel");
const { User } = require("../models/User");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { channelName, serverId, isPrivate } = req.body;

    if (channelName.length > 20) {
      return res.status(400).send({ message: "Channel name should be less than 20" });
    }

    const server = await Server.findById(serverId)
      .then((s) => {
        const newChannel = Channel({
          name: channelName,
          server: serverId,
          isPrivate: isPrivate,
        })
          .save()
          .then((channel) => {
            s.channels.push(channel.id);
            s.save();
            if (isPrivate) {
              channel.members.push(req.user.id);
              channel.save();
            }
            res.status(200).json(channel);
          });
      })
      .catch((err) => res.status(404).send({ message: "Server Not Found" }));
  }
);

// Create DM channel
router.post(
  "/create/dm",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { members } = req.body;
    console.log("members : ", members)
    const channelName = `${members[0]}:${members[1]}`

    const channel = await Channel.find({
      name: { "$regex": `${members[0]}:${members[1]}`, "$options": "i" },
      name: { "$regex": `${members[1]}:${members[0]}`, "$options": "i" }
    })
    
    console.log("channel : ", channel)
    if (channel.length > 0) {
      return res.status(400).send({ message: "Channel already exists" });
    }

    var newChannel = new Channel({ name: channelName, members })

    newChannel.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      console.log("result : ", result)
      res.json(result);
    });
  }
);


// Get user's DM channel
router.post(
  "/get/dm",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { userId } = req.body;

    const channel = await Channel.find({
      name: { "$regex": userId, "$options": "i" },
    }).populate({
      path: "members",
      populate: { path: "members" },
      select: '-password -servers'
    })

    res.json(channel)
  }
);

// Get Channel Info
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const cId = req.params.id;

    const channel = await Channel.findById(cId)
      .populate({
        path: "members",
        populate: { path: "members" },
      })
      .then((c) => res.status(200).json(c))
      .catch((err) => console.log(err));
  }
);

// Add members to private channels
router.post(
  "/addMember",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { channelId, userId } = req.body;

    const channel = await Channel.findById(channelId)
      .populate({
        path: "server",
        populate: { path: "server" },
      })
      .then((c) => {
        if (String(c.server.owner) === String(req.user.id)) {
          for (let i = 0; i < c.members.length; i++) {
            if (String(c.members[i]) === userId) {
              return res
                .status(400)
                .send({ message: "User already in this channel" });
            }
          }

          c.members.push(userId);
          c.save();
          return res.status(200).json(c);
        } else {
          return res
            .status(400)
            .send({ message: "You do not have permission to do that" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: "Channel does not exist!" });
      });
  }
);

// Remove members from private channels

router.post(
  "/removeMember",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { channelId, userId } = req.body;

    const channel = await Channel.findById(channelId)
      .populate({
        path: "server",
        populate: { path: "server" },
      })
      .then((c) => {
        if (String(c.server.owner) === String(req.user.id)) {
          for (let i = 0; i < c.members.length; i++) {
            if (String(c.members[i]) === userId) {
              c.members.splice(i, 1);
              c.save();
              return res.status(200).send({ message: "User removed" });
            }
          }
        } else {
          return res
            .status(400)
            .send({ message: "You do not have permission to do that" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: "Channel does not exist!" });
      });
  }
);

// Edit Channel Name
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const cId = req.params.id;
    const { name } = req.body;

    if (name.length < 4 || name.length > 15) {
      res.status(400).send({ message: "Channel name not the right length" });
    } else {
      Channel.findById(cId).then((channel) => {
        channel.name = name;
        channel
          .save()
          .then((u) => res.status(200).send(u))
          .catch((err) => console.log(err));
      });
    }
  }
);

//Delete Channel
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { channelId, serverId } = req.body;

    const server = await Server.findById(serverId)
      .then((s) => {
        if (String(s.owner) === String(req.user.id)) {
          for (let i = 0; i < s.channels.length; i++) {
            if (String(s.channels[i]) === channelId) {
              s.channels.splice(i, 1);
              break;
            }
          }
          s.save();
          Channel.findByIdAndDelete(channelId).then(c =>
            res.status(200).json(c)
          );
        }
        else {
          return res
            .status(400)
            .send({ message: "You do not have permission to do that" });
        }
      }).catch(err => res.status(400).send({ message: "Server does not exists!" }));
  }
);

module.exports = router;
