import asyncHandler from "express-async-handler"
import Post from "../model/postModel.js"


const createPost = asyncHandler(async(req, res) => {
    const postData = {
        user: req.user._id,
        content: req.body.content,
    }
    if(req.body.replyTo) {
        postData.replyTo = req.body.replyTo
    }

    const post = await Post.create(postData)

    const newUpdatedPost = post && await Post.find({}).sort({createdAt: -1})
    .populate({path:"retweetData", populate:{path:"user"}})
    .populate({path:"replyTo", populate:{path:"user"}})
    .populate("user", "-password")
    
    if(newUpdatedPost) {
        res.status(201).json(newUpdatedPost)
    } else {
        res.status(400).json({message:"Something went Wrong!!!"})
    }
})

const getPosts = asyncHandler(async(req, res) => {
    const post = await Post.find({}).sort({createdAt: -1})
    .populate({path:"retweetData", populate:{path:"user"}})
    .populate("user", "-password")
    .populate({path:"replyTo", populate:{path:"user"}})
    if(post) {
        res.status(201).json(post)
    } else {
        res.status(400).json({message:"Something went Wrong!!!"})
    }
})

const getPostsById = asyncHandler(async(req, res) => {
    const postData = await Post.findById(req.params.id)
    .populate({path:"retweetData", populate:{path:"user"}})
    .populate("user", "-password")
    .populate({path:"replyTo", populate:{path:"user"}})

    var result = {
        postData: postData
    }

    if(postData.replyTo !== undefined) {
        postData.replyTo = postData.replyTo
    }

    result.replies = await Post.find({replyTo: req.params.id})
                                .populate("user", "-password")
                                .populate({path:"replyTo", populate:{path:"user"}})
    if(result) {
        res.status(201).json(result)
    } else {
        res.status(400).json({message:"Something went Wrong!!!"})
    }
})

const createUsersLike = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.body.id)
    const isLiked = post.likes && post.likes.includes(req.user._id)
    var options = isLiked ? "$pull" : "$addToSet"
    
    const updated = await Post.findByIdAndUpdate(req.body.id,  {[options]:{likes: req.user._id}}, {new: true})
    .populate("user", "-password")
    .populate({path:"retweetData", populate:{path:"user"}})
    .populate({path:"replyTo", populate:{path:"user"}})

    const newData = updated && await Post.find({}).sort({createdAt: -1})
    .populate({path:"retweetData", populate:{path:"user"}})
    .populate("user", "-password")
    .populate({path:"replyTo", populate:{path:"user"}})

    if(newData) {
        res.status(200).json(newData)
    } else {
        res.status(400).json({message:"Not liked"})
    }
})

const createUsersRetweet = asyncHandler(async(req, res) => {
    const deletedPost = await Post.findOneAndDelete({user: req.user._id, retweetData: req.body.id})

    var options = deletedPost !== null ? "$pull" : "$addToSet"
    let repost = deletedPost

    if(repost == null) {
        repost = await Post.create({
            user: req.user._id,
            retweetData: req.body.id
        })
    }
    
    const updated = await Post.findByIdAndUpdate(req.body.id,  {[options]:{retweetUsers: req.user._id}}, {new: true}).populate("user", "-password")
    const newData = updated && await Post.find({}).sort({createdAt: -1})
    .populate({path:"retweetData", populate:{path:"user"}})
    .populate("user", "-password")
    .populate({path:"replyTo", populate:{path:"user"}})
    
    if(newData) {
        res.status(200).json(newData)
    } else {
        res.status(400).json({message:"Something went wrong"})
    }
})

const deletePostById = asyncHandler(async(req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id)
        
    const allPost = post && await Post.find({}).sort({createdAt: -1})
    .populate({path:"retweetData", populate:{path:"user"}})
    .populate("user", "-password")
    .populate({path:"replyTo", populate:{path:"user"}})

    if(allPost) {
        res.status(201).json(allPost)
    } else {
        res.status(400).json({message:"Something went Wrong!!!"})
    }
})




export {createPost, getPosts, createUsersLike, createUsersRetweet, getPostsById, deletePostById}