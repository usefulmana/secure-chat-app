const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const PrivateMessageSchema = new Schema({

    message: {
        type: String,
        required: true,
        trim: true,
        minlength: ['1', 'Chat message must be at least 1 characters long'],
    },

    from : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    to : {
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

PrivateMessageSchema.plugin(mongoosePaginate);

const PrivateMessage = mongoose.model('PrivateMessage', PrivateMessageSchema);

module.exports = { PrivateMessage };
