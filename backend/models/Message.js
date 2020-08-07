const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
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
    admin: {
        type: Boolean,
        default: false
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
