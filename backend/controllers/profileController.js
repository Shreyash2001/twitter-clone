import asyncHandler from "express-async-handler"
import User from "../model/userModel.js"
import Post from "../model/postModel.js"

const getUserProfile = asyncHandler(async(req, res) => {
    var results = {}
    var userProfile = await User.findById( req.user.id).select("-password").populate("following").populate("followers")

    results.userProfile = userProfile
    results.posts = await Post.find({ $and: [ { user: userProfile._id }, { replyTo: { $exists: false } } ] })
                               .populate({path:"retweetData", populate:{path:"user"}})
                               .populate({path:"replyTo", populate:{path:"user"}})
                               .populate("user", "-password")

    results.replies = await Post.find({ $and: [ { user: userProfile._id }, { replyTo: { $exists: true } } ] })
                               .populate({path:"retweetData", populate:{path:"user"}})
                               .populate({path:"replyTo", populate:{path:"user"}})
                               .populate("user", "-password")
    
    if(results) {
        res.status(200).json(results)
    } else {
        res.status(400).json({message:"Not found"})
    }
})

const getUserProfileByUserName = asyncHandler(async(req, res) => {
    var results = {}
    var userProfile = await User.findOne({userName: req.params.username}).select("-password")
    if(userProfile === null) {
        userProfile = await User.findById(req.params.username)
    }
    results.userProfile = userProfile
    results.posts = await Post.find({ $and: [ { user: userProfile._id }, { replyTo: { $exists: false } } ] })
                               .populate({path:"retweetData", populate:{path:"user"}})
                               .populate({path:"replyTo", populate:{path:"user"}})
                               .populate("user", "-password")

    results.replies = await Post.find({ $and: [ { user: userProfile._id }, { replyTo: { $exists: true } } ] })
                               .populate({path:"retweetData", populate:{path:"user"}})
                               .populate({path:"replyTo", populate:{path:"user"}})
                               .populate("user", "-password")
    
    if(results) {
        res.status(200).json(results)
    } else {
        res.status(400).json({message:"Not found"})
    }
})

const usersFollowers = asyncHandler(async(req, res) => {
    const userProfile = await User.findOne({userName: req.params.username}).select("-password").populate("followers").populate("following")
    if(userProfile) {
        res.status(200).json(userProfile)
    } else {
        res.status(404).json({message:"Not found"})
    }
})

export {getUserProfile, getUserProfileByUserName, usersFollowers}