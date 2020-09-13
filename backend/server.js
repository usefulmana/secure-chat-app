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

// ** Model **
const { Message } = require("./models/Message");
const { PrivateMessage } = require("./models/PrivateMessage");
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

// ** Log the routes **
app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`);
  next();
});

// ** SocketIO

let clients = [];
io.on("connection", (socket) => {
  // console.log(socket, " has been connected")
  let sessionUserId = "";
  // testing
  socket.on("test", async (msg) => {
    console.log("listening on test and got message : ", msg)
  });

  // Normal Chat Message in a channel
  socket.on("chat-message", async (msg) => {
    const newMessage = Message({
      user: msg.userId,
      channel: msg.channelId,
      message: msg.message,
    })
      .save()
      .then((msg) => {
        payload = { type: "message", payload: msg };

        io.to(msg.serverId).emit("update", payload);
      });
  });

  // One to one direct message
  socket.on("private-chat-message", async (msg) => {
    const newPrivateMessage = PrivateMessage({
      message: msg.message,
      from: msg.from,
      to: msg.to,
    }).save();

    // Find which socket to send TO
    action = {
      type: "private-message",
      payload: {
        from: message.from,
        to: message.to,
        msg: message.msg,
        user: message.from.toLowerCase(),
      },
    };
    clients.find((client) => {
      if (client.userId === to[0].user_id) {
        io.to(client.id).emit("update", action);
      }
    });

    // Find which socket to
    action = {
      type: 'private-message',
      payload: { from: message.from, to: message.to, msg: message.msg, user: message.to.toLowerCase() }
    };
    clients.find(client => {
      if (client.userId === from[0].user_id) {
        io.to(client.id).emit('update', action);
      }
    });

  });

  // When a users sign in, he/she sends over his/her userId
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
  socket.on("subscribe", (serverId) => {
    socket.join(serverId);
  });

  // Update active status (every 5 minutes)
  socket.on("update-active", () => {
    const user = User.findById(sessionUserId);
    user.lastActive = new Date();
    user.save();
  });

  // Signaling for webRTC
  socket.on("voice-signal", (data) => {
    const toId = data.userId;
    data.userId = sessionUserId;
    let action = { type: "voice-signal ", payload: data };
    clients.find((client) => {
      if (client.userId === toId) {
        io.to(client.id).emit("update", action);
      }
    });
  });

  // Emit list of connections when user joins voice on specific channel
  socket.on("user-join-voice", (data) => {
    // Join room with channel id
    socket.join(data.channelId);
    // Get socket ids for users in that channel
    const socketIdsInChannel = Object.keys(
      io.sockets.in(data.channelId).sockets
    );
    const userIdsInChannel = [];
    // Find user ids in channel
    clients.forEach((client) => {
      socketIdsInChannel.forEach((socketId) => {
        if (client.id === socketId)
          userIdsInChannel.push({
            userId: client.userId,
            userName: client.userName,
          });
      });
    });

    // Emit to everyone on this channel, the socketid of new user, and list of clients in room
    let action = {
      type: "user-join-voice",
      payload: { userId: data.userId, clients: userIdsInChannel },
    };
    io.to(data.channelId).emit("update", action);
  });

  // Emit list of connections when user leaves voice on specific channel
  socket.on("user-leave-voice", (data) => {
    // Leave channel
    socket.leave(data.channelId);
    const userIdsInChannel = [];
    // Emit to everyone in that room that user left voice
    io.in(data.channelId).clients((error, socketClients) => {
      socketClients.forEach((socketClientId) => {
        // Find user ids in channel
        clients.forEach((client) => {
          if (client.id === socketClientId) {
            userIdsInChannel.push({
              userId: client.userId,
              userName: client.userName,
            });
          }
        });
      });

      let action = {
        type: "user-leave-voice",
        payload: { userId: data.userId, clients: userIdsInChannel },
      };
      io.to(data.channelId).emit("update", action);
    });
  });

  // On disconnect, remove from the client list
  socket.on("disconnect", () => {
    clients.find((client, i) => {
      if (client.userId === sessionUserId) {
        // Emit to all connected users that this user left (disconnects all voice peering calls with him)
        let action = {
          type: "user-leave-voice",
          payload: { userId: client.userId },
        };
        socket.emit("update", action);
        // Remove from global socket client list
        return clients.splice(i, 1);
      }
    });
  });
});

// ** Run server **
if (process.env.NODE_ENV !== "test") {
  server.listen(process.env.PORT, () => {
    console.log(`[INFO] Server is running on port ${process.env.PORT}`);
  });
}
module.exports = { app };
