const express = require("express");
const {
  createMessage,
  getMessages,
} = require("../controllers/messageController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/:id").get(protect, getMessages);
router.route("/").post(protect, createMessage);

module.exports = router;
