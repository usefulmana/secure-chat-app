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
    Server.findById(req.params.id).populate({
      path: 'channels',
      populate: {path: 'channels'}
    }).then((team) => {
      if (!team) res.status(400).send({ error: "Server does not exist!" });

      res.status(200).json(team);
    });
  }
);

// Add User to server
router.post("/add", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const {userId, serverId} = req.body;

  const user = await User.findById(userId).then((u) => {
    Server.findById(serverId)
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
  }).catch((err) => res.status(400).send({message: "No user with such Id"}));
})

// User leave server
router.post("/leave", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const {serverId} = req.body;

  const user = await User.findById(req.user.id).then((u) => {
    Server.findById(serverId)
      .then(server => {
          for (let i = 0; i < server.members.length; i++){
              if (server.members[i] == req.user.id){
                  server.members.splice(i, 1);
                  break;
              }
          }
          for (let i = 0; i < u.servers.length; i++){
            if (u.servers[i] == serverId){
                u.servers.splice(i, 1);
                break;
            }
          }
          u.save();
          server.save()
          .then( s => {
            res.status(200).send(s)
          });
      })
      .catch((err) => {
        res.status(400).send({ message: "Invalid server code" });
      });
  }).catch((err) => res.status(400).send({message: "No user with such Id"}));
})

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
        User.findById(req.user.id)
          .then((u) => {
            const newChannel = new Channel({
              name: "general",
              isPrivate: false,
              server: server._id,
            })
              .save()
              .then((c) => {

                u.servers.push(server.id);
                u.save();
                server.channels.push(c.id);
                server.save();
                res.status(201).json(server)});
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

// Delete a server
router.delete("/:id",  passport.authenticate("jwt", { session: false }), async(req, res) => {
  const serverId = req.params.id;
  
  if (!serverId){
    return res.status(400).send({message: "No server Id"})
  }

  Server.findById(serverId).then(s => {
    for (let i = 0; i < s.channels.length; i++) {
      Channel.findByIdAndDelete(s.channels[i], function (err, result) {
        if (err) {
            res.status(404);
            res.send('Channel could not be deleted');
        } else {
            res.status(200);
            res.send('Channel deleted successfully');
        }
    })
    }
  })
  Server.findByIdAndDelete(serverId).then(s => res.status(200).json(s))
})

// Edit a server
router.put("/:id",  passport.authenticate("jwt", { session: false }), async(req, res) => {
  const serverId = req.params.id;
  
  if (!serverId){
    return res.status(400).send({message: "No server Id"})
  }

  const { name, description } = req.body;
  Server.findById(serverId).then((s) => {
    s.name = name;
    s.description = description;
    s.save().then(u => res.status(200).send(u)).catch(err => console.log(err));
});

})
  
  
  

module.exports = router;
