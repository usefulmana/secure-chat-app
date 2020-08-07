if (process.env.DEPLOYMENT !== "true") {
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
                servers: [`http://localhost:3001`]
            }
        },

        apis: ["./routes/*.js"]
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));
};

// ** Routes **
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require('./routes/teamRoutes');
const userRoutes = require('./routes/userRoutes')

// ** Middleware **

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(expressValidator());
app.use(cors());

// ** Route Definitions **
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/team", teamRoutes);
app.use('/api/v1/user', userRoutes);
// ** Run server **
if (process.env.NODE_ENV !== "test") {
    server.listen(process.env.PORT, () => {
        console.log(`[INFO] Server is running on port ${process.env.PORT}`);
    });
}
module.exports = { app };
