const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
    },

    isGroupChat: {
      type: Boolean,
      default: true,
    },

    users: [{ type: mongoose.Types.ObjectId, ref: "User" }],

    latestMessage: { type: mongoose.Types.ObjectId, ref: "Message" },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
