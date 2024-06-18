const express = require("express");
const {
  registerUser,
  authUser,
  likedPosts,
  followUnfollowUsers,
  followersfollowingInfo,
  updateUserImage,
  updateUserCoverImage,
  getSearchedUsers,
} = require("../controllers/userController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/search?").get(protect, getSearchedUsers);
router.route("/update-coverPhoto").put(protect, updateUserCoverImage);
router.route("/update-image").put(protect, updateUserImage);
router.route("/post/like").put(protect, likedPosts);
router
  .route("/follow")
  .put(protect, followUnfollowUsers)
  .get(protect, followersfollowingInfo);
router.route("/login").post(authUser);
router.route("/register").post(registerUser);

module.exports = router;
