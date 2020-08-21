if (process.env.NODE_ENV !== 'production') {
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
                title: 'Chat App API',
                version: '1.0.0',
                description: 'A collection of API endpoints for a secure chat app',
                license: {
                    name: "MIT",
                    url: "https://choosealicense.com/licenses/mit/"
                },
                contact: {
                    name: "Anh Nguyen",
                    email: "alex.nguyen.3141@gmail.com"
                },
                servers: [process.env.SWAGGER_URL]
            }
        },

        apis: ["./routes/*.js"]
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));
};

// ** Routes **
const authRoutes = require("./routes/authRoutes");
const serverRoutes = require('./routes/serverRoutes');
const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/channelRoutes');

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

// ** SocketIO

// {userId, userName, id}

let clients = [];
io.on('connection', socket => {
    
    let sessionUserId = '';

    // Normal Chat Message in a channel
    socket.on('chat-message', async msg => {

        const newMessage = Message({
            user: msg.userId,
            channel: msg.channelId,
            message: msg.message
        }).save().then( msg => {

            payload = {type: 'message', payload: msg};

            io.to(serverId).emit('update', payload);
        });

    });

    // One to one direct message
    socket.on('private-chat-message', async msg => {



    });

    // When a users sign in, he/she sends over his/her userId
    // Add to a list of clients userId to identify socket.id
    socket.on('sign-in', data => {
        sessionUserId = data.userId;
        clients.push({userId: sessionUserId, id: socket.id, username: data.username});
        const user = User.findById(userId);
        user.lastActive = new Date();
        user.save().then(u => console.log(u));
    });

    // Listens for subscribed server
    socket.on('subscribe', serverId => {
        socket.join(serverId);
    });

     // Update active status (every 5 minutes)
    socket.on('update-active', () => {
        const user = User.findById(sessionUserId);
        user.lastActive = new Date();
        user.save();
    });

    // Signaling for webRTC
    socket.on('voice-signal', data => {

    });

    // Emit list of connections when user joins voice on specific channel
    socket.on('user-join-voice', data => {

    });

    // Emit list of connections when user leaves voice on specific channel
    socket.on('user-leave-voice', data => {

    });


    // On disconnect, remove from the client list  
    socket.on('disconnect', () =>{
        console.log('${name} disconnected from server');
    })
})


// ** Run server **
if (process.env.NODE_ENV !== "test") {
    server.listen(process.env.PORT, () => {
        console.log(`[INFO] Server is running on port ${process.env.PORT}`);
    });
}
module.exports = { app };
