const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({

    message: {
        type: String,
        required: true,
        trim: true,
        minlength: ['1', 'Chat message must be at least 1 characters long'],
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
    }

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

MessageSchema.plugin(mongoosePaginate);

const Message = mongoose.model('Message', MessageSchema);

module.exports = { Message };
