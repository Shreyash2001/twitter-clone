import asyncHandler from "express-async-handler"
import Message from "../model/messageModel.js"
import Chat from "../model/chatModel.js"
import User from "../model/userModel.js"
import Notification from "../model/notificationModel.js"

const createMessage = asyncHandler(async(req, res) => {

    var data = {}

    if(!req.body.message || !req.body.id) {
        res.status(400).json({message:"Invalid Data sent."})
    }

    const newMessage = {
        sender: req.user._id,
        content: req.body.message,
        chat: req.body.id,
        readBy: [req.user._id]
    }
    var message = await Message.create(newMessage)
    message = await message.populate("sender").execPopulate()
    message = await message.populate("chat").execPopulate()
    message = await User.populate(message, {path: "chat.users"})
    
    data.message = message && message

    const chats = await Message.find({chat: req.body.id}).populate("sender").populate("chat")

    data.chats = chats && chats

  var notificationChat = await Chat.findByIdAndUpdate(req.body.id, {latestMessage: message}, {new: true})
  
   insertNotifications(notificationChat, message)

    if(data) {
        res.status(201).json(data)
    } else {
        res.status(400).json({message:"Something went wrong!!!"})
    }
})

    function insertNotifications(chat, message) {
    chat.users.map(userId => {
        
        if(userId.toString() === message.sender._id.toString()) return
        Notification.insertNotification(userId, message.sender._id, "newMessage", chat._id)
    })
    }


const getMessages = asyncHandler(async(req, res) => {
    await Message.updateMany({chat: req.params.id}, {$addToSet: {readBy: req.user._id}})
    const chats = await Message.find({chat: req.params.id}).populate("sender").populate("chat")
    
    if(chats) {
        res.status(200).json(chats)
    } else {
        res.status(404).json({message:"Not found"})
    }
})

export {createMessage, getMessages}