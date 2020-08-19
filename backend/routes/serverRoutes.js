const express = require("express");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const { Server } = require("../models/Server");
const { Channel } = require("../models/Channel");
const { User } = require("../models/User");
const {
  createErrorObject,
  checkCreateTeamFields,
} = require("../middleware/authenticate");


// Get A Server

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Server.findById(req.params.id).then((team) => {
      if (!team) res.status(400).send({ error: "Server does not exist!" });

      res.status(200).json(team);
    });
  }
);

// Create A Server
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  checkCreateTeamFields,
  async (req, res) => {
    let errors = [];

    const newServer = new Server({
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id,
      members: [req.user.id],
    });

    Server.create(newServer)
      .then((server) => {
        User.findByIdAndUpdate(
          req.user.id,
          { $push: { server: server._id } },
          { new: true, useFindAndModify: false }
        )
          .then((u) => {
            const newChannel = new Channel({
              name: "general",
              isPrivate: false,
              server: server._id,
            })
              .save()
              .then((c) => res.status(201).json(server));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

// Join A Server
router.post(
  "/join",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId).then((u) => {
      const { serverCode } = req.body;
      Server.findOne({ code: serverCode })
        .then(server => {
            for (let i = 0; i < server.members.length; i++){
                if (server.members[i] == userId){
                    return res.status(400).send({ message: "Already in the server" });
                }
            }
            server.members.push(userId);
            server.save()
            .then( s => res.status(200).send(s));
        })
        .catch((err) => {
          res.status(400).send({ message: "Invalid server code" });
        });
    });
  }
);

// Get Active Users
router.get("/active/:id",  passport.authenticate("jwt", { session: false }), async(req, res) => {
  const serverId = req.params.id;
  
  if (!serverId){
    return res.status(400).send({message: "No server Id"})
  }

  const server = await Server.findById(serverId)
  .populate({
    path: 'members',
    populate: {path: 'members'}
  })
  .then( s => {
    
    const currentTime = moment(Date.now());
    

    const activeUsers = s.members.filter( u => moment.duration(currentTime.diff(u.lastActive)).asMinutes() <= 100);

    console.log(activeUsers);

    // console.log(moment.duration(currentTime.diff(lastActive)).asMinutes())
    res.status(200).json(activeUsers);
  })
  .catch(err => {
    console.log(err);
  });

});

module.exports = router;