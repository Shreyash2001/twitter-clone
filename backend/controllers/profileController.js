const asyncHandler = require("express-async-handler");
const User = require("../model/userModel.js");
const Post = require("../model/postModel.js");
const mongoose = require("mongoose");

const getUserProfile = asyncHandler(async (req, res) => {
  var results = {};
  var userProfile = await User.findById(req.user._id)
    .select("-password")
    .populate("following")
    .populate("followers");

  results.userProfile = userProfile;
  results.posts = await Post.find({
    $and: [{ user: userProfile._id }, { replyTo: { $exists: false } }],
  })
    .sort({ createdAt: -1 })
    .populate({ path: "retweetData", populate: { path: "user" } })
    .populate({ path: "replyTo", populate: { path: "user" } })
    .populate("user", "-password");

  results.replies = await Post.find({
    $and: [{ user: userProfile._id }, { replyTo: { $exists: true } }],
  })
    .sort({ createdAt: -1 })
    .populate({ path: "retweetData", populate: { path: "user" } })
    .populate({ path: "replyTo", populate: { path: "user" } })
    .populate("user", "-password");

  if (results) {
    res.status(200).json(results);
  } else {
    res.status(400).json({ message: "Not found" });
  }
});

const getUserProfileByUserName = asyncHandler(async (req, res) => {
  var results = {};
  var userProfile = await User.findOne({
    userName: req.params.username,
  }).select("-password");
  const isValid = mongoose.isValidObjectId(req.params.username);
  if (userProfile === null && isValid) {
    userProfile = await User.findById(req.params.username);
  }
  results.userProfile = userProfile;
  results.posts = await Post.find({
    $and: [{ user: userProfile._id }, { replyTo: { $exists: false } }],
  })
    .sort({ createdAt: -1 })
    .populate({ path: "retweetData", populate: { path: "user" } })
    .populate({ path: "replyTo", populate: { path: "user" } })
    .populate("user", "-password");

  results.replies = await Post.find({
    $and: [{ user: userProfile._id }, { replyTo: { $exists: true } }],
  })
    .sort({ createdAt: -1 })
    .populate({ path: "retweetData", populate: { path: "user" } })
    .populate({ path: "replyTo", populate: { path: "user" } })
    .populate("user", "-password");

  if (results) {
    res.status(200).json(results);
  } else {
    res.status(400).json({ message: "Not found" });
  }
});

const usersFollowers = asyncHandler(async (req, res) => {
  const userProfile = await User.findOne({ userName: req.params.username })
    .select("-password")
    .populate("followers")
    .populate("following");
  if (userProfile) {
    res.status(200).json(userProfile);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = { getUserProfile, getUserProfileByUserName, usersFollowers };
