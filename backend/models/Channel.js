const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChannelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: ["4", "Channel name must be at least 4 characters long"],
      maxlength: ["50", "Channel name have to be less than 50 characters long"],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    server: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "Server",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = { Channel };
