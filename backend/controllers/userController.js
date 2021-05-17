import asyncHandler from "express-async-handler"
import User from "../model/userModel.js"
import Post from "../model/postModel.js"
import generateToken from "../utils/generateToken.js"
import Notification from "../model/notificationModel.js"

const authUser = asyncHandler(async(req, res) => {
    const {userName, email, password} = req.body
    const user = await User.findOne({$or:[{email}, {userName}]})
    if(user && (await user.matchPassword(password))) {
        res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            image: user.image,
            coverPhoto: user.coverPhoto,
            following: user.following,
            followers: user.followers,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({message:"Invalid email or password"})
    }
})

const registerUser = asyncHandler(async(req, res) => {
    const {firstName, lastName, userName, email, password} = req.body
    const alreadyUser = await User.findOne({$or:[{email}, {userName}]})
    if(alreadyUser) {
        res.status(400).json({message:"Username or Email already present"})
    } else {
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password,
        })
        if(user) {
            res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            token: generateToken(user._id)
            })
        } else {
            res.status(400).json({message:"Something went wrong!!!"})
        }
    }
    
})

const likedPosts = asyncHandler(async(req, res) => {
    const isLiked = req.user.likes && req.user.likes.includes(req.body.id)
    var options = isLiked ? "$pull" : "$addToSet"
    const updated = await User.findByIdAndUpdate(req.user._id,  {[options]:{likes: req.body.id}}, {new: true})

    if(updated) {
        res.status(200).json(updated)
    } else {
        res.status(400).json({message:"Not liked"})
    }
})

const followUnfollowUsers = asyncHandler(async(req, res) => {
    var updated = {}
    const isFollowing = req.user.following && req.user.following.includes(req.body.id)
    var options = isFollowing ? "$pull" : "$addToSet"
     await User.findByIdAndUpdate(req.user._id,  {[options]:{following: req.body.id}}, {new: true})

      updated.user = await User.findByIdAndUpdate(req.body.id,  {[options]:{followers: req.user._id}}, {new: true})
      updated.loggedInUser = await User.findById(req.user._id).select("-password")
      
    if(!isFollowing) {
        await Notification.insertNotification(req.body.id, req.user._id, "follow", req.user._id)
    }

    if(updated) {
        res.status(200).json(updated)
    } else {
        res.status(400).json({message:"Not liked"})
    }
})

const followersfollowingInfo = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("-password")
    if(user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({message:"Not found"})
    }
})

const updateUserImage = asyncHandler(async(req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {image: req.body.url}, {new: true}).select("-password")
    var results = {}
    var userProfile = await User.findById(req.user._id)
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

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {coverPhoto: req.body.url}, {new: true}).select("-password")
    var results = {}
    var userProfile = await User.findById(req.user._id)
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

const getSearchedUsers = asyncHandler(async(req, res) => {
    if(req.query.users !== "") {
    const users = await User.find({$or:[{firstName: {$regex: req.query.users, $options:"i"}}, 
    {lastName: {$regex: req.query.users, $options:"i"}},
     {userName: {$regex: req.query.users, $options:"i"}}]})
    .populate("user", "-password")
    .populate({path:"replyTo", populate:{path:"user"}})
    if(users) {
        res.status(200).json(users)
    } else {
        res.status(404).json({message:"Not found"})
    }
    } else {
        return res.status(200).json([])
    }
    
})

export {registerUser, authUser, likedPosts, followUnfollowUsers, followersfollowingInfo, updateUserImage, updateUserCoverImage, getSearchedUsers}