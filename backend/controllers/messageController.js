import asyncHandler from "express-async-handler"
import Message from "../model/messageModel.js"
import Chat from "../model/chatModel.js"

const createMessage = asyncHandler(async(req, res) => {

    if(!req.body.message || !req.body.id) {
        res.status(400).json({message:"Invalid Data sent."})
    }

    const newMessage = {
        sender: req.user._id,
        content: req.body.message,
        chat: req.body.id,
    }
    var message = await Message.create(newMessage)

    const chats = await Message.find({chat: req.body.id}).populate("sender").populate("chat")

   await Chat.findByIdAndUpdate(req.body.id, {latestMessage: message}, {new: true})
    
    if(chats) {
        res.status(201).json(chats)
    } else {
        res.status(400).json({message:"Something went wrong!!!"})
    }
})

const getMessages = asyncHandler(async(req, res) => {
    const chats = await Message.find({chat: req.params.id}).populate("sender").populate("chat")
    if(chats) {
        res.status(200).json(chats)
    } else {
        res.status(404).json({message:"Not found"})
    }
})

export {createMessage, getMessages}