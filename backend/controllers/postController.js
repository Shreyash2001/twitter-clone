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

const createUsersLike = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.body.id)
    const isLiked = post.likes && post.likes.includes(req.user._id)
    var options = isLiked ? "$pull" : "$addToSet"
    
    const updated = await Post.findByIdAndUpdate(req.body.id,  {[options]:{likes: req.user._id}}, {new: true}).populate("user", "-password")

    if(updated) {
        res.status(200).json(updated)
    } else {
        res.status(400).json({message:"Not liked"})
    }
})





export {createPost, getPosts, createUsersLike}