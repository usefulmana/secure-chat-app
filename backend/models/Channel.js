const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChannelSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: ['4', 'Channel name must be at least 4 characters long'],
        maxlength: ['15', 'Channel name have to be less than 15 characters long']
    },

    isPrivate: {
        type: Boolean,
        default: false
    },

    owner : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    members: [
        {
            _id: false,
            lookup: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            socketId: {
                type: String,
                required: true
            }
        }
    ]

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


const Channel = mongoose.model('Channel', ChannelSchema);

module.exports = { Channel };
