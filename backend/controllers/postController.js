const asyncHandler = require("express-async-handler");
const Notification = require("../model/notificationModel.js");
const Post = require("../model/postModel.js");
const User = require("../model/userModel.js");

const createPost = asyncHandler(async (req, res) => {
  const postData = {
    user: req.user._id,
    content: req.body.content,
    image: req.body.image,
  };
  if (req.body.replyTo) {
    postData.replyTo = req.body.replyTo;
  }

  var post = await Post.create(postData);

  post = await User.populate(post, { path: "user" });
  post = await Post.populate(post, { path: "replyTo" });

  if (post.replyTo !== undefined) {
    await Notification.insertNotification(
      post.replyTo.user._id,
      req.user._id,
      "reply",
      post._id
    );
  }

  const user = await User.findById(req.user._id);
  const updateUser = user.following.push(req.user._id);

  const newUpdatedPost =
    post &&
    (await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "retweetData", populate: { path: "user" } })
      .populate({ path: "replyTo", populate: { path: "user" } })
      .populate("user", "-password"));

  if (newUpdatedPost) {
    res.status(201).json(newUpdatedPost);
  } else {
    res.status(400).json({ message: "Something went Wrong!!!" });
  }
});

const getPosts = asyncHandler(async (req, res) => {
  if (req.body.userId === undefined) {
    const twitterOfficial = await User.findOne({
      userName: "twitter_official",
    });
    const post = await Post.find({ user: twitterOfficial._id })
      .populate({ path: "retweetData", populate: { path: "user" } })
      .populate("user", "-password")
      .populate({ path: "replyTo", populate: { path: "user" } });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Something is missing" });
    }
  }
  if (req.body.userId !== undefined) {
    const user = await User.findById(req.body.userId);
    var updateUser = user.following.push(req.body.userId);
    if (user.following.length < 2) {
      const twitterOfficial = await User.findOne({
        userName: "twitter_official",
      });
      updateUser = user.following.push(req.body.userId, twitterOfficial._id);

      const post = await Post.find({ user: { $in: user.following } })
        .sort({ createdAt: -1 })
        .populate({ path: "retweetData", populate: { path: "user" } })
        .populate("user", "-password")
        .populate({ path: "replyTo", populate: { path: "user" } });
      if (post) {
        res.status(201).json(post);
      } else {
        res.status(400).json({ message: "Something went Wrong!!!" });
      }
    }

    const post = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "retweetData", populate: { path: "user" } })
      .populate("user", "-password")
      .populate({ path: "replyTo", populate: { path: "user" } });
    if (post) {
      res.status(201).json(post);
    } else {
      res.status(400).json({ message: "Something went Wrong!!!" });
    }
  }
});

const getPostsById = asyncHandler(async (req, res) => {
  const postData = await Post.findById(req.params.id)
    .populate({ path: "retweetData", populate: { path: "user" } })
    .populate("user", "-password")
    .populate({ path: "replyTo", populate: { path: "user" } })
    .populate({ path: "replyTo", populate: { path: "retweetData" } });

  var result = {
    postData: postData,
  };

  if (postData.replyTo !== undefined) {
    postData.replyTo = postData.replyTo;
  }

  result.replies = await Post.find({ replyTo: req.params.id })
    .populate("user", "-password")
    .populate({ path: "replyTo", populate: { path: "user" } });
  if (result) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ message: "Something went Wrong!!!" });
  }
});

const createUsersLike = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const updateUser = user.following.push(req.user._id);

  const post = await Post.findById(req.body.id);
  const isLiked = post.likes && post.likes.includes(req.user._id);
  var options = isLiked ? "$pull" : "$addToSet";

  const updated = await Post.findByIdAndUpdate(
    req.body.id,
    { [options]: { likes: req.user._id } },
    { new: true }
  )
    .populate("user", "-password")
    .populate({ path: "retweetData", populate: { path: "user" } })
    .populate({ path: "replyTo", populate: { path: "user" } });

  const newData =
    updated &&
    (await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "retweetData", populate: { path: "user" } })
      .populate("user", "-password")
      .populate({ path: "replyTo", populate: { path: "user" } }));

  var userId = req.user._id;

  if (!isLiked && post.user._id.toString() !== req.user._id.toString()) {
    await Notification.insertNotification(
      updated.user._id,
      userId,
      "postLike",
      updated._id
    );
  }

  if (newData) {
    res.status(200).json(newData);
  } else {
    res.status(400).json({ message: "Not liked" });
  }
});

const createUsersRetweet = asyncHandler(async (req, res) => {
  const deletedPost = await Post.findOneAndDelete({
    user: req.user._id,
    retweetData: req.body.id,
  });

  var options = deletedPost !== null ? "$pull" : "$addToSet";
  let repost = deletedPost;

  if (repost == null) {
    repost = await Post.create({
      user: req.user._id,
      retweetData: req.body.id,
    });
  }

  const updated = await Post.findByIdAndUpdate(
    req.body.id,
    { [options]: { retweetUsers: req.user._id } },
    { new: true }
  ).populate("user", "-password");
  const user = await User.findById(req.user._id);
  const updateUser = user.following.push(req.user._id);

  const newData =
    updated &&
    (await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "retweetData", populate: { path: "user" } })
      .populate("user", "-password")
      .populate({ path: "replyTo", populate: { path: "user" } }));

  var userId = req.user._id;

  if (!deletedPost) {
    await Notification.insertNotification(
      updated.user._id,
      userId,
      "retweet",
      updated._id
    );
  }

  if (newData) {
    res.status(200).json(newData);
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
});

const deletePostById = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  const user = await User.findById(req.user._id);
  const updateUser = user.following.push(req.user._id);

  const allPost =
    post &&
    (await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "retweetData", populate: { path: "user" } })
      .populate("user", "-password")
      .populate({ path: "replyTo", populate: { path: "user" } }));

  if (allPost) {
    res.status(201).json(allPost);
  } else {
    res.status(400).json({ message: "Something went Wrong!!!" });
  }
});

const pinPostById = asyncHandler(async (req, res) => {
  if (req.body.pinned !== undefined) {
    await Post.updateMany(
      { user: req.user._id },
      { pinned: false },
      { new: true }
    ).catch((error) => {
      console.log(error);
    });
  }
  const post = await Post.findByIdAndUpdate(req.params.id, req.body);
  const user = await User.findById(req.user._id);
  const updateUser = user.following.push(req.user._id);

  const allPost =
    post &&
    (await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "retweetData", populate: { path: "user" } })
      .populate("user", "-password")
      .populate({ path: "replyTo", populate: { path: "user" } }));

  if (allPost) {
    res.status(201).json(allPost);
  } else {
    res.status(400).json({ message: "Something went Wrong!!!" });
  }
});

const getSearchedPosts = asyncHandler(async (req, res) => {
  if (req.query.posts !== "") {
    const posts = await Post.find({
      content: { $regex: req.query.posts, $options: "i" },
    })
      .populate({ path: "retweetData", populate: { path: "user" } })
      .populate("user", "-password")
      .populate({ path: "replyTo", populate: { path: "user" } });
    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } else {
    return res.status(200).json([]);
  }
});

module.exports = {
  createPost,
  getPosts,
  createUsersLike,
  createUsersRetweet,
  getPostsById,
  deletePostById,
  pinPostById,
  getSearchedPosts,
};
