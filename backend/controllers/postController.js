import asyncHandler from "express-async-handler"
import Post from "../model/postModel.js"
import User from "../model/userModel.js"

const createPost = asyncHandler(async(req, res) => {
    const post = await Post.create({
        user: req.user._id,
        content: req.body.content,
    })
    if(post) {
        const newPost = await User.populate(post, {path: "user"})
        res.status(201).json(newPost)
    } else {
        res.status(400).json({message:"Something went Wrong!!!"})
    }
})

const getPosts = asyncHandler(async(req, res) => {
    const post = await Post.find({}).sort({createdAt: -1}).populate("user", "-password")
    if(post) {
        res.status(201).json(post)
    } else {
        res.status(400).json({message:"Something went Wrong!!!"})
    }
})

export {createPost, getPosts}