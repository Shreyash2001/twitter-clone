const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel.js");
const User = require("../model/userModel.js");
const mongoose = require("mongoose");

const createChat = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.users);

  if (data.length === 0) {
    return res.status(400).json({ message: "Please add users" });
  }
  data.push(req.user._id);

  const chatData = {
    isGroupChat: true,
    users: data,
  };

  const chat = await Chat.create(chatData);

  if (chat) {
    res.status(201).json(chat);
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
});

const getChats = asyncHandler(async (req, res) => {
  var chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users")
    .populate({ path: "latestMessage", populate: { path: "sender" } })
    .sort({ updatedAt: -1 });

  if (chats) {
    res.status(200).json(chats);
  } else {
    res.status(400).json({ message: "Nothing found" });
  }
});

const getUnreadChats = asyncHandler(async (req, res) => {
  var chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users")
    .populate({ path: "latestMessage", populate: { path: "sender" } })
    .sort({ updatedAt: -1 });

  chats = chats.filter(
    (r) => r.latestMessage && !r.latestMessage.readBy.includes(req.user._id)
  );

  if (chats) {
    res.status(200).json(chats);
  } else {
    res.status(400).json({ message: "Nothing found" });
  }
});

const getChatsById = asyncHandler(async (req, res) => {
  var userId = req.user._id;
  var chatId = req.params.id;
  const isValid = mongoose.isValidObjectId(chatId);

  if (!isValid) {
    res.status(400).json({
      message: "Chat does not exist or You don't have permission to acces it.",
    });
  }

  var chats = await Chat.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }).populate("users");

  if (chats === null) {
    var userFound = await User.findById(chatId);

    if (userFound !== null) {
      chats = await Chat.findOneAndUpdate(
        {
          isGroupChat: false,
          users: {
            $size: 2,
            $all: [
              { $elemMatch: { $eq: mongoose.Types.ObjectId(userId) } },
              { $elemMatch: { $eq: mongoose.Types.ObjectId(userFound._id) } },
            ],
          },
        },
        {
          $setOnInsert: {
            users: [userId, userFound._id],
          },
        },
        {
          new: true,
          upsert: true,
        }
      ).populate("users");
    }
  }

  if (chats === null) {
    res.status(404).json({
      message: "Chat does not exist or You don't have permission to acces it.",
    });
  } else {
    res.status(200).json(chats);
  }
});

const updateChatName = asyncHandler(async (req, res) => {
  const chatName = await Chat.findByIdAndUpdate(
    req.params.id,
    { chatName: req.body.name },
    { new: true }
  );
  const chats =
    chatName &&
    (await Chat.findOne({
      _id: req.params.id,
      users: { $elemMatch: { $eq: req.user._id } },
    }).populate("users"));

  if (chats) {
    res.status(200).json(chats);
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
});

module.exports = {
  createChat,
  getChats,
  getChatsById,
  updateChatName,
  getUnreadChats,
};
