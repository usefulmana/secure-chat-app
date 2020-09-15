const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const randomString = require('random-base64-string');

const ServerSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: ['4', 'Team name must be at least 4 characters long'],
        maxlength: ['50', 'Team name have to be less than 50 characters long']
    },

    code: {
        type: String,
        trim: true,
    },

    description: {
        type: String,
        trim: true
    },

    image: {
        type: String,
        trim: true
    },

    owner : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    channels: [{
        type: Schema.Types.ObjectId,
        ref: 'Channel'
    }],

    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


const Server = mongoose.model('Server', ServerSchema);

module.exports = { Server };