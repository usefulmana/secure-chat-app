const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({

    message: {
        type: String,
        required: true,
        trim: true
    },

    channel: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Channel'
    },

    user : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


const Message = mongoose.model('Message', MessageSchema);

module.exports = { Message };
