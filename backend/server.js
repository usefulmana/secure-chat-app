if (process.env.NODE_ENV !== "production") {
  // Skip loading the .env file
  require("dotenv").config();
}

// ** Connect to MongoDB **
const mongoose = require("mongoose");
require("./db/database");

// ** Passport Config **
const passport = require("passport");
require("./config/passport")(passport);

// ** Express **
const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const helmet = require("helmet");

// ** Socket IO **
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// ** Swagger API Doc **
if (process.env.NODE_ENV === "development") {
  const swaggerJsDoc = require("swagger-jsdoc");
  const swaggerUi = require("swagger-ui-express");

  // ** Configure Swagger **
  // Extended: https://swagger.io/specification/#infoObject
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Chat App API",
        version: "1.0.0",
        description: "A collection of API endpoints for a secure chat app",
        license: {
          name: "MIT",
          url: "https://choosealicense.com/licenses/mit/",
        },
        contact: {
          name: "Anh Nguyen",
          email: "alex.nguyen.3141@gmail.com",
        },
        servers: [process.env.SWAGGER_URL],
      },
    },

    apis: ["./routes/*.js"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, { explorer: true })
  );
}

// ** Routes **
const authRoutes = require("./routes/authRoutes");
const serverRoutes = require("./routes/serverRoutes");
const userRoutes = require("./routes/userRoutes");
const channelRoutes = require("./routes/channelRoutes");
const messageRoutes = require("./routes/messageRoutes");

// ** Model **
const { Message } = require("./models/Message");
const { User } = require("./models/User");

// ** Middleware **

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(expressValidator());
app.use(cors());

// ** Route Definitions **
app.use("/api/auth", authRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/user", userRoutes);
app.use("/api/channel", channelRoutes);
app.use("/api/chat", messageRoutes);

// ** Log the routes **
app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`);
  next();
});

// ** SocketIO

let clients = [];


// ** For live chatting
const rooms = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  let sessionUserId = "";

  // Normal Chat Message in a channel
  socket.on("chat-message", async (msg) => {

    socket.emit("test", "go test")

    const newMessage = Message({
      user: msg.userId,
      channel: msg.channelId,
      message: msg.message,
    })
      .save()
      .then((data) => {
        payload = { type: "message", payload: data };
        // send event to everyone inside the room including sender
        io.to(msg.channelId).emit(`${msg.channelId}-update`, payload);
        // send event to everyone inside the room except sender
        socket.broadcast.to(msg.channelId).emit(`${msg.channelId}-notification`, payload);
      });
  });

  // Sam's comment : this is not used
  // Normal Chat Message in a channel
  // socket.on("private-channel-message", async (msg) => {
  //   const newMessage = Message({
  //     user: msg.userId,
  //     channel: msg.channelId,
  //     message: msg.message,
  //   })
  //     .save()
  //     .then((msg) => {
  //       payload = { type: "message", payload: msg };

  //       io.to(msg.channelId).emit("update", payload);
  //     });
  // });

  // Sam's comment : this is not used
  // One to one direct message
  // socket.on("private-chat-message", async (msg) => {
  //   const newPrivateMessage = PrivateMessage({
  //     message: msg.message,
  //     from: msg.from,
  //     to: msg.to,
  //   }).save();

  //   // Find which socket to send TO
  //   action = {
  //     type: "private-message",
  //     payload: {
  //       from: message.from,
  //       to: message.to,
  //       msg: message.msg,
  //       user: message.from.toLowerCase(),
  //     },
  //   };
  //   clients.find((client) => {
  //     if (client.userId === to[0].user_id) {
  //       io.to(client.id).emit("update", action);
  //     }
  //   });

  //   // Find which socket to
  //   action = {
  //     type: 'private-message',
  //     payload: { from: message.from, to: message.to, msg: message.msg, user: message.to.toLowerCase() }
  //   };
  //   clients.find(client => {
  //     if (client.userId === from[0].user_id) {
  //       io.to(client.id).emit('update', action);
  //     }
  //   });

  // });

  // When a rooms sign in, he/she sends over his/her userId
  // Add to a list of clients userId to identify socket.id
  socket.on("sign-in", (data) => {
    sessionUserId = data.userId;
    clients.push({
      userId: sessionUserId,
      id: socket.id,
      username: data.username,
    });
    const user = User.findById(userId);
    user.lastActive = new Date();
    user.save().then((u) => console.log(u));
  });

  // Listens for subscribed server
  socket.on("subscribe", (channelId) => {
    socket.join(channelId);
  });

  // Update active status (every 5 minutes)
  socket.on("update-active", () => {
    const user = User.findById(sessionUserId);
    user.lastActive = new Date();
    user.save();
  });

  /*========================
  Sam's live chat code
  ========================*/
  console.log("socket joined : ", socket.id)

  socket.on("is-channel-on-call", roomID => {
    console.log("evnt is-channel-on-call received : roomId : ", roomID)
    var isOnline = false
    if (rooms[roomID] && rooms[roomID].length > 0) {
      isOnline = true
    }

    console.log("Emitting channel-status : isOnline : ", isOnline)
    socket.emit('channel-status', isOnline)
  })

  socket.on("calling", channelId => {
    console.log("Receiving  calling : ", channelId)

    socket.broadcast.to(channelId).emit('receiving call');
    console.log("Sending calling : ", channelId)
  })


  socket.on("join room", ({ roomID, username }) => {
    console.log("socket id: ", socket.id, " joined room event received roomId: ", roomID)
    if (rooms[roomID]) {
      // const length = rooms[roomID].length;
      // if (length === 4) {
      //   socket.emit("room full");
      //   return;
      // }
      rooms[roomID].push({ socketId: socket.id, username });
    } else {
      rooms[roomID] = [{ socketId: socket.id, username }];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = rooms[roomID].filter(user => user.socketId !== socket.id);
    console.log("sedning all roomse event and user in room : ", usersInThisRoom)

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", payload => {
    console.log("sending user joined event to ", payload.userToSignal)
    io.to(payload.userToSignal.socketId).emit('user joined', { signal: payload.signal, callerID: payload.callerID, username: payload.username });
  });

  socket.on("returning signal", payload => {
    console.log("received returning signal and sending receiving returned signal to ", payload.callerID)
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on("user-toggle-video", payload => {
    console.log("user-toggle-vdeio event : ", { roomId: payload.roomID, id: socket.id, video: payload.video })
    io.to(payload.roomID).emit('send-video-toggled', { id: socket.id, ...payload });
  });

  socket.on('disconnect', () => {
    console.log(socket.id, " has been disconnected")
    const roomID = socketToRoom[socket.id];
    let room = rooms[roomID];
    console.log("room : ", room)
    if (room) {
      room = room.filter(user => user.socketId !== socket.id);
      rooms[roomID] = room;

      console.log("room after filter: ", room)
      room.map((user) => {
        io.to(user.socketId).emit('user left', { peerID: socket.id });
      })
      console.log("room.length : ", room.length)

      if (room.length === 0) {
        console.log("emit call finisehd event : room : ", room)
        // console.log("emit call finisehd event")
        io.to(roomID).emit('call finished');
        // socket.broadcast.to(roomID).emit('call finished');

      }
    }
  });

  // socket.on('disconnect-live-chat', () => {
  //   const roomID = socketToRoom[socket.id];
  //   let room = rooms[roomID];
  //   if (room) {
  //     room = room.filter(id => id !== socket.id);
  //     rooms[roomID] = room;

  //     room.map((id) => {
  //       io.to(id).emit('user left', { peerId: socket.id });
  //     })

  //     console.log("room.length : ", room.length)
  //     if (room.length === 0) {
  //       console.log("emit call finisehd event")
  //       io.to(room).emit('call finished');
  //     }
  //   }
  // });

  /*========================
  Anh's live chat code
   ========================*/

  // Signaling for webRTC
  //   socket.on("voice-signal", (data) => {
  //     const toId = data.userId;
  //     data.userId = sessionUserId;
  //     let action = { type: "voice-signal ", payload: data };
  //     clients.find((client) => {
  //       if (client.userId === toId) {
  //         io.to(client.id).emit("update", action);
  //       }
  //     });
  //   });

  //   // Emit list of connections when user joins voice on specific channel
  //   socket.on("user-join-voice", (data) => {
  //     // Join room with channel id
  //     socket.join(data.channelId);
  //     // Get socket ids for rooms in that channel
  //     const socketIdsInChannel = Object.keys(
  //       io.sockets.in(data.channelId).sockets
  //     );
  //     const userIdsInChannel = [];
  //     // Find user ids in channel
  //     clients.forEach((client) => {
  //       socketIdsInChannel.forEach((socketId) => {
  //         if (client.id === socketId)
  //           userIdsInChannel.push({
  //             userId: client.userId,
  //             userName: client.userName,
  //           });
  //       });
  //     });

  //     // Emit to everyone on this channel, the socketid of new user, and list of clients in room
  //     let action = {
  //       type: "user-join-voice",
  //       payload: { userId: data.userId, clients: userIdsInChannel },
  //     };
  //     io.to(data.channelId).emit("update", action);
  //   });

  //   // Emit list of connections when user leaves voice on specific channel
  //   socket.on("user-leave-voice", (data) => {
  //     // Leave channel
  //     socket.leave(data.channelId);
  //     const userIdsInChannel = [];
  //     // Emit to everyone in that room that user left voice
  //     io.in(data.channelId).clients((error, socketClients) => {
  //       socketClients.forEach((socketClientId) => {
  //         // Find user ids in channel
  //         clients.forEach((client) => {
  //           if (client.id === socketClientId) {
  //             userIdsInChannel.push({
  //               userId: client.userId,
  //               userName: client.userName,
  //             });
  //           }
  //         });
  //       });

  //       let action = {
  //         type: "user-leave-voice",
  //         payload: { userId: data.userId, clients: userIdsInChannel },
  //       };
  //       io.to(data.channelId).emit("update", action);
  //     });
  //   });

  //   // On disconnect, remove from the client list
  //   socket.on("disconnect", () => {
  //     clients.find((client, i) => {
  //       if (client.userId === sessionUserId) {
  //         // Emit to all connected rooms that this user left (disconnects all voice peering calls with him)
  //         let action = {
  //           type: "user-leave-voice",
  //           payload: { userId: client.userId },
  //         };
  //         socket.emit("update", action);
  //         // Remove from global socket client list
  //         return clients.splice(i, 1);
  //       }
  //     });
  //   });
});

// ** Run server **
if (process.env.NODE_ENV !== "test") {
  server.listen(process.env.PORT, () => {
    console.log(`[INFO] Server is running on port ${process.env.PORT}`);
  });
}
module.exports = { app };
