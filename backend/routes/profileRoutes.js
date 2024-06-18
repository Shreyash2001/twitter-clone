const express = require("express");
const {
  getUserProfile,
  getUserProfileByUserName,
  usersFollowers,
} = require("../controllers/profileController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/:username/followers").get(protect, usersFollowers);
router.route("/:username").get(getUserProfileByUserName);
router.route("/").get(protect, getUserProfile);

module.exports = router;
