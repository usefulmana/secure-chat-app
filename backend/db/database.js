const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connect to database
const connect = () => {
    mongoose.connect(
        process.env.DATABASE_URL,
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
        err => {
            if (err) {
                console.error(err);
                return;
            }

            if (process.env.NODE_ENV !== 'test'){
                console.info('Successfully connected to MongoDB');
            }
        }
    );
};

connect();

// export database connection
module.exports = { mongoose, connect };