if (process.env.DEPLOYMENT !== 'true'){
    // Skip loading the .env file
    require('dotenv').config();
}

// ** Connect to MongoDB **
const mongoose = require('mongoose');
require('./db/database');

// ** Passport Config **
const passport = require('passport');
require('./config/passport')(passport);


// ** Express **
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');

// ** Socket IO **
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// ** Routes **
const authRoutes = require('./routes/authRoutes');

// ** Middleware **

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(expressValidator());
app.use(cors());

// ** Route Definitions **
app.use('/api/v1/auth', authRoutes);

// ** Run server **
if (process.env.NODE_ENV !== 'test'){
    server.listen(process.env.PORT, () => {
        console.log(`[INFO] Server is running on port ${process.env.PORT}`)
    });
};
module.exports = { app };