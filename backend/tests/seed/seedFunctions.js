require('dotenv').config();
const { mongoose, connect } = require('../../db/database');
const { User } = require('../../models/User');
const gravatar = require('gravatar');
const { userSeedData } = require('./seedData');

const populateData = async () => {

    if (mongoose.connection.readyState === 0) {
        connect();
    }

    let userId;

    console.log('\nSeeding User Data');

    await User.deleteMany({}).exec();

    for (let user of userSeedData) {
        const userData = await new User({
            username: user.username,
            email: user.email,
            password: user.password,
            image: gravatar.url(user.email, { s: '220', r: 'pg', d: 'identicon' })
        }).save();
        userId = userData._id;
    }

    console.log('Completed Seeding User Data');
    await mongoose.connection.close();
};

module.exports = { populateData };