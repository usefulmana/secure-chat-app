const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const randomString = require('random-base64-string');

const TeamSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: ['4', 'Channel name must be at least 4 characters long'],
        maxlength: ['50', 'Channel name have to be less than 50 characters long']
    },

    invitationCode: {
        type: String,
        trim: true,
        default: randomString(8)
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

    // channels: [{
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Channel'
    // }]

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


const Team = mongoose.model('Team', TeamSchema);

module.exports = { Team };